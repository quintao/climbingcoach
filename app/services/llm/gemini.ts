import { GoogleGenerativeAI } from "@google/generative-ai";

function build_one_activity(activity: any, index: number) {
    let activity_info = []
  
    const dd = new Date(activity.completion_date);
  
    activity_info.push("\n\nWorkout #" + index +", completed on  " + dd.toDateString())
    activity_info.push("Workout ID: " + activity.id)
    activity_info.push("Proposed training: " + activity.workout)
    if (activity.feedback) {
      activity_info.push("Feedback from the climber about workout #" + index +": \"" + activity.feedback + "\"")
    }
    return activity_info.join("\n")
  }
  
  async function generate(prompt: string) {
    const apiKey = "AIzaSyCUGuL9nhMQ18wdFWhb943TM3Jjeee9BuQ"
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text(); 
  }

  export async function GenerateTraining(history: string, goals: string, injuries: string, french_grading: boolean, activities: any, preferences: string) {
    let prompt = []
    const today = "Today is " + new Date().toDateString()
    prompt.push(today)

    const intro = "You're a climbing coach; you should help a rock climber who's trying to improve their climbing skills."
    prompt.push(intro)

    const how = "You will help the climbing by suggesting a training session."
    prompt.push(how)


    if (history != '') {
        const context = "This is some information provided by the climber with personal CONTEXT and their HISTORY with the sport:  \"" + history + "\""
        prompt.push(context)
    }
  
    if (injuries != '') {
      const injueries_prompt = "This is relevant information about injuries and/or health concerns from the climber:  \"" + injuries + "\""
      prompt.push(injueries_prompt)
      prompt.push("You should make sure that the training session you suggest does not make the injury worse.")
    } else {
        prompt.push("The climber does not report any injuries right now.")
    }
  
    if (goals != '') {
        const what_to_achieve = "These are the goals that the climber is trying to achieve now, using their own words: \"" + goals  + "\""
        prompt.push(what_to_achieve)
    }
    
    const three_weeks_ago = Date.now() - (21 * 24 * 60 * 60 * 1000)
 
    if (activities.length > 0) {
      let recent_activities_list = []
      for (const activity of activities) {
        if (activity.completion_date > three_weeks_ago) {
          recent_activities_list.push(build_one_activity(activity, recent_activities_list.length + 1))
        }
      }

      if (recent_activities_list.length > 0) {
        prompt.push("These are the last " + recent_activities_list.length + " workouts the climber has performed:")        
        prompt.push(recent_activities_list.join("\n"))
        prompt.push(`\n\nYou should take these last workouts into consideration when designing a workout for today.
        For example, the workout you suggest today should be different from the previous ones and it should exercise different aspects of climbing.
        As another example, if the previous workout focused on strength, you can suggest now something that focuses on technique or endurance. Be creative.
        You should also take into consideration WHEN the previous training sessions were done. Do not over train the climber with hard sessions close to each other.
        You should also take into consideration the feedback that the climber provided the previous training sessions.`)
    }

    } else {
      prompt.push(`In terms of last workouts, the climber has not done much in the last days. Take that into consideration when suggesting a workout: perhaps the climber needs a ramp-up phase.`)
    }
  
    if (preferences) {
      prompt.push("\n\nFor today, these are the preferences of the climber: \"" + preferences + "\"")
      prompt.push(`You should respect the preferences of the climber, especially if they talk about duration of the workout, and if the climber mentioned being tired.
        If the climber mentions that they want to do a sport that is different from climbing, you should make sure that this sport does not negatively impact the climbing fitness of the climber.`)
    }
    
    const target = `The workout should be aligned with the goal of the climber, the preferences for today's session, the CONTEXT and HISTORY of the climber, current injuries if they are mentioned, and the feedback provided by the climber for the last workouts.
    As a rule of thumb, the workouts should not be very hard. It's better to err on the side of having something fun and easier.

    The workout plan should consist of the following information:
    A section called "Goals for this session": in this section, you should explain the goals behind the training that you suggested. It should be short and straight to the point.
    A section called "The workout" that lists the workout.

    You should not provide other information such as a "conclusion", etc. Please do not talk about the climber's history.`
    prompt.push(target)
    if (french_grading == true) {
        prompt.push(`When talking about lead climbing, use the French lead climbing grading system (6a, 6b, 7c+ etc). When talking about bouldering,
        use the french bouldering grading system (6A, 6B, 8B+).`)
    } else {
        prompt.push(`When talking about lead climbing, use the US lead climbing grading system (5.9, 5.10a, 5.12c etc). When talking about bouldering,
        use the V bouldering grading system (V0, V1, V10 etc).`)
    }
    
    prompt.push("Please suggest a workout session for the climber to do today.")

    const final_prompt = prompt.join("\n")
    const result = await generate(final_prompt);
    return result
  }

  export async function MakeItEasier(workout: string) {
    let prompt = []
    const intro = "You're a climbing coach; You generated the training below but the climber found it too hard. Make it a little bit easier."
    prompt.push(intro)
    prompt.push(workout)
    prompt.push(`You should only provide the workout plan, and no other information, introduction, etc")
      When talking about lead climbing, use the French lead climbing grading system (6a, 6b, 7c+ etc). When talking about bouldering, use the french bouldering grading system (6A, 6B, 8B+).`)
    const final_prompt = prompt.join("\n")
    const result = await generate(final_prompt);
    return result
  }

  export async function MakeItHarder(workout: string) {
    let prompt = []
    const intro = "You're a climbing coach; You generated the training below but the climber found it too easy. Make it a little bit harder."
    prompt.push(intro)
    prompt.push(workout)
    prompt.push(`You should only provide the workout plan, and no other information, introduction, etc")
      When talking about lead climbing, use the French lead climbing grading system (6a, 6b, 7c+ etc). When talking about bouldering, use the french bouldering grading system (6A, 6B, 8B+).`)

    const final_prompt = prompt.join("\n")
    const result = await generate(final_prompt);
    return result
  }

  function cleanJson(jsonString: string) {
    try {
    // Remove the leading and trailing '```json' and '```'
        const cleanedJson = jsonString.replace(/^```json/, '').replace(/```/, '');
        console.log(cleanedJson)

      // Parse the cleaned JSON string
      return JSON.parse(cleanedJson);
    } catch (error){
        console.log(error)
        return jsonString
    }
  }
  
  export async function GenerateReport(activities: any, goals: string) {
    let prompt = []

    let data = []
    for (const a of activities) {
        data.push(a)
    }
    data.sort((a, b) => b.completion_date - a.completion_date);

    const today = "Today is " + new Date().toDateString()
    prompt.push(today)
    const intro = "You are a sports analyst, focused on analysing the performance of climbing athletes."
    prompt.push(intro)

    const goals_p = "You are analysing the last workouts of a climber whose GOALS in climbing are, in their own words: " + goals
    prompt.push(goals_p)

    prompt.push(`Your task is to provide an EXPERT ANALYSIS of a list of workouts performed by a climber in a period .

        You will be given a list of workouts, sorted from the most recent one to the least recent one.
        The workouts consist of a "Proposed training", which lists what the climber was expected to do in that particular session,
        and a "Feedback from the climber about workout", which contains the feedback the climber provided for that particular "proposed training".

        For the EXPERT ANALYSIS, you should review the workouts and their "proposed training" and "feedback from the climber" data and
        generate an expert-level summary with approximately 100 words containing interesting insights that you learned from the data. The summary should be
        easy to read, engaging, but it should not be cheesy.
        Examples of insights that you can highlight:

        - If you noticed a progress in the hardest grade the climber has climbed, you should have a discussion about it.

        - If the climber has consistently climbed at the level they want to according to their GOALS, you should bring that into their attention,
        and instruct them to provide more ambitious goals.

        - If you the climber consistently reported injuries or pain, you should remind them of the importance to seek health care support.
        
        - You can comment on volume of climbing if it is relevant; if it's too much, bring awareness about over-training. If too little, remind the
        climber that improvement comes from continuous training. In this case, you should be encouraging, never provide shame. Typically, we want climbers to do at least two sessions
        per week to keep their fitness, and at least 3 sessions to progress with their climbing.
        
        - You should provide any other insights that you learn from the data, as long as they are backed by studies that did research on sports performance.

        - If you noticed a progress in the last month, you should congratulate the climber for the hard work.

        You should refer to the climber as "you", not as "the climber", since your analysis will be shared with the climber.

        For the injuries analysis, you should review the most recent feedback from the climber and count how often the climber mentioned being injured or feeling pain.

        You should return a JSON file that has the following fields:
        {
          "expert": your expert analysis go here,
          "injuries": how many injuries you found in the most recent feedback from the climber.
        }
       `)

    prompt.push()

    const one_month_ago = Date.now() - (30 * 24 * 60 * 60 * 1000)

    if (data.length > 0) {
        let recent_activities_list = []
        for (const activity of data) {
            if (activity.completion_date >= one_month_ago) {
                recent_activities_list.push(build_one_activity(activity, recent_activities_list.length + 1))
            }
        }      
      if (recent_activities_list.length > 0) {
        prompt.push("Below you find the " + recent_activities_list.length + " workouts the climber has performed. Each workout ends with '#####'")
        prompt.push(recent_activities_list.join("#####\n"))

      }  
    }
    
    prompt.push("Please generate your the JSON with your EXPERT ANALYSIS and the injuries analysis.")

    const final_prompt = prompt.join("\n")
    const result = await generate(final_prompt);
    const js = cleanJson(result)
    console.log(js)

    return js
  }

  export async function ClassifyWorkout(workout: any, feedback: string) {
    let prompt = []
    prompt.push("Today is " + new Date().toDateString())

    prompt.push(`You are a sports analyst, focused on analysing the performance of climbing athletes.
You are analysing the last workout of a climber; your task is to determine which sport activities were performed during the workout.

Each workout contains a few fields, as described below:

- proposed training: this is what the coach suggested as the workout. It's a plain text that lists the sport activities to be performed during the workout.
- feedback from the climber: this is a a plain text field that contains the feedback provided by the climber about the proposed training, as well as observations about was done, what was not done, and how the climber felt after the training.
- id: the ID of the workout.

Your task is to read the workout AND the feedback from the climber and understand which sport activities were performed during the workout. One workout can include multiple sport activities. The activities we care about are listed below:


       - BOULDERING: this is a climbing activity that consists of climbing walls that are not so high; it can be performed indoors or outdoors. Typically, boulder sessions in the french grade system contain grades which have a number and a capital letter, such as 5B, 6C, 7B. In the US grade system, these sessions contain grades with the V scale, like V2, V5, V10.
       - ROPE CLIMBING: this includes activities that should be considered as rope climbing, including top-rope and lead climbing. In the french grade system, routes are labeled with a number and a lower letter, such as 6b, 8a, etc. In the US grade system, we use the 5 scale and routes look like 5.12, 5.11, 5.4. Via ferratas should NOT be included here.
       - FINGER STRENGTH: this includes activities such as fingerboarding or campus boarding.
       - CLIMBING RELATED ACTIVITIES:  activities where the climber performed activities that are not bouldering/rope climbing, but that require similar skills, for example: alpinism, via ferrata, mountaineering.
       - OUTDOOR CLIMBING:  activities where the climber went outdoors for "BOULDERING" OR "ROPE CLIMBING". Typically these activities will mention that the climber went to a crag or a cliff or did a climb with multiple pitches. If you are not sure if the workout happened indoor or outdoor, you should assume it is indoor.
       - OTHER SPORTS: other sports, such as fitness training, running, cycling, rolling, core strength, etc.
    
        You should return an object in JSON, that has the following keys: 
         {
           id: ID of the workout that was provided in the input.
           activities: list of activities that were performed in the input.
           reason:  your explanation as to why those activities were performed.
         }

     Follow the examples below for an input and you should generate:


Input:
Workout #1, completed on  Sun Oct 20 2024
Workout ID: 1729414990223
Proposed training: ## Goals for this session:

* Maintain cardiovascular fitness through a fun activity.
* Build endurance for multi-pitch climbing by simulating the sustained effort required on longer routes.

## The workout:

* **Warm-up:** 10 minutes of light spinning on the stationary bike, focusing on building up a moderate heart rate.
* **Road Cycling:** Choose a scenic route with some gentle hills to challenge your endurance. Aim for a ride of 1-2 hours at a comfortable pace, maintaining a steady breathing rhythm throughout. 
* **Cool-down:** After your ride, take 5 minutes to stretch your legs and back, focusing on any muscles that feel tight or fatigued. 

Feedback from the climber about workout #1: "30.4km in 1h43, 700m of elevation gain.

I didn't push much, heart rate max of 159, average of 113."#####
 
Output:
{
   id: 1729414990223
   activities: ["OTHER SPORTS"],
   reason:  "The climber went cycling, so the activity should be tagged with OTHER SPORTS.
 }

Input:
Workout #2, completed on  Sat Oct 19 2024
Workout ID: 1729344761333
Proposed training: Went for a 5km run with my friend Yohann. Very chill, pace 6:17km/h, we talked during the run etc.
Feedback from the climber about workout #2: "Felt good, this was an easy run just to move a bit after bouldering in the morning".

Output:
{
   id: 1729344761333
   activities: ["OTHER SPORTS"],
   reason:  "The climber went running, so the activity should be tagged as OTHER SPORTS. It's also known that the climber went bouldering in the morning, but this activity is not part of the current workout.
 }

Input:
Workout #3, completed on  Sat Oct 19 2024
Workout ID: 1729337232604
Proposed training: 20 minutes bouldering session at Yohann's place, in his home climbing wall.
Around 5 easy boulders in the 5B-6A range.
Feedback from the climber about workout #3: "I feel sore from yesterday. One finger in my right hand is not 100%, a bit painful."

Output:
{
   id: 1729337232604
   activities: ["BOULDERING"],
   reason:  "The climber states that they went bouldering at his friend's place",
}


Input:
Workout #4, completed on  Fri Oct 18 2024
Workout ID: 1729268557470
Proposed training: ## Goals for this session:

* Work on technical aspects of climbing to improve movement efficiency and confidence on harder routes.
* Gain experience attempting 7A/B problems with a focus on technique and learning from each attempt.

## The workout:

* **Warm-up:** 10 minutes of light cardio, followed by dynamic stretching focusing on shoulders, back, and hips.
* **Bouldering:**
   *  ** Climbing: ** Select one easy 6a route to lead climb as warm up.
    * **Technical Focus:** Select 3-4 new problems in the 6A-6B range that challenge your technique and require precise footwork, body positioning, and efficient movement.
    * **7A/B Attempt:**  Choose 1-2 7A/B problems that you find interesting. Focus on climbing with good technique and trying different beta options. Don't worry about sending, the goal is to learn and feel confident on these grades. 
    * **Problem Analysis:**  After each attempt, take a break and analyze your movements, identify areas for improvement, and brainstorm different beta options. 
* **Cool-down:** 10 minutes of static stretching, focusing on muscles worked during the session. 

Feedback from the climber about workout #4: "Warm up good!
6A-B range: focused on technique.

For the 7A-B range:
Went for a 7B I have been working on. Tried one first beta and didn't go well. In the second attempt, sent it with a new beta! So it's 7B baby :)

I had some energy left so I did:
- one easy 6C twice, to explore different betas.
- one hard 6C, perhaps 6C+, that I had not done yet.

Very very good session!"

Output:
{
   id: 1729268557470
   activities: ["CLIMBING, BOULDERING"],
   reason:  "The proposed plan suggested CLIMBING and BOULDERING, and the climber said that everything went well, so the climber achieved to perform both activities",
}

Input:

Workout #5, completed on  Wed Oct 16 2024
Workout ID: 1729089225791
Proposed training: ## Goals for this session:

* Maintain finger strength and endurance with a low-impact session.
* Focus on specific hold types to build strength and technique for various climbing styles.

## The workout:

* **Warm-up:** 5 minutes of light cardio, followed by 5 minutes of dynamic stretching focusing on shoulders, back, and hips.
* **Fingerboard:**
    *  **1 set of 10 seconds on each hold, followed by 10 seconds rest:** Repeat for 3 sets on each hold type:
        * **Jugs:** Focus on maintaining good form and tension, engaging the lats and core. 
        * **Crimps:**  Use a slightly easier crimp to focus on proper technique and avoid overloading the tendons. 
        * **Pockets:**  Use a moderate-sized pocket, focusing on developing strength and dexterity.
*** Bouldering: three boulders up to 6B+
* **Cool-down:** 5 minutes of static stretching, focusing on forearms, fingers, and wrists. 

Feedback from the climber about workout #5: "I did the fingerboarding session but I was too tired to do the boulder session so I skipped it"


Output:
{
   id: 1729089225791
   activities: ["FINGER STRENGTH"],
   reason:  "The proposed plan suggested FINGER STRENGTH and the some BOULDERING, however the climber said he was too tired to do the bouldering, so the workout should be tagged only with FINGER STRENGTH",
}

Please provide the output object for the following input:
"`)
  const activity = build_one_activity(workout, 1)
  prompt.push(activity)
  prompt.push("Feedback from the climber about workout #1: " + feedback)
  const final_prompt = prompt.join("\n")
  const result = await generate(final_prompt);
  const js = cleanJson(result)
  return js
}