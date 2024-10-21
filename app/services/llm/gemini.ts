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
    const apiKey = ""
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
        const cleanedJson = jsonString.replace(/^```json/, '').replace(/```$/, '');
      // Parse the cleaned JSON string
      return JSON.parse(cleanedJson);
    } catch {
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

    prompt.push(`
        Your task is to provide STATISTICS ANALYSIS and an EXPERT ANALYSIS of a list of workouts performed by a climber in a period of a few months.

        You will be given a list of workouts, sorted from the most recent one to the least recent one.
        The workouts consist of a "Proposed training", which lists what the climber was expected to do in that particular session,
        and a "Feedback from the climber about workout", which contains the feedback the climber provided for that particular "proposed training".
        Each workout also has an id that you will have to use in this task.

        For the STATISTICS ANALYSIS, you should review the "proposed training" and the "feedback from the climber" for each workout,
        and understand the activities performed in that workout. You should count the following activities:

        - bouldering: list of ids of the workouts where climber performed activities that should be considered as "bouldering". Typically, boulder sessions in the french grade system contain grades which have a number and a capital letter, such as 5B, 6C, 7B. In the US grade system, these sessions contain grades wih the V scale, like V2, V5, V10.
        - rope climbing: list of ids of the workouts where the climber performed activities that should be considered as rope climbing, including top-rope and lead climbing. In the french grade system, routes are labeled with a number and a lower letter, such as 6b, 8a, etc. In the US grade system, we use the 5 scale and routes look like 5.12, 5.11, 5.4. Via ferratas should NOT be included here.
        - boarding: list of ids of the workouts where the climber performed activities such as fingerboarding or campus boarding.
        - climbing-related activities: list of ids of the workouts where the climber performed activities that are not bouldering/rope climbing, but that require similar
        skills, for example: alpinism, via ferrata, mountaineering. These activities should not count for the "outdoor climbing" item below.
        - outdoor climbing: list of ids of the workouts where the climber went outdoors for "bouldering" OR "rope climbing". If you are not sure if the workout happened indoor or outdoor, you should assume it is indoor.
        - other sports: list of ids of the workouts where the climber performed other sports, such as fitness training, running, cycling, rolling, core strength, etc.
        - injuries: how many times the climber reported being injured, having pain or not feeling well in the "feedback from the climber" entries.
        
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

        You should return an object in JSON, that has the following keys: 
         {
           "bouldering": the list of ids you found for "bouldering" in the STATISTICS ANALYSIS,
           "rope": the list of ids you found for "rope climbing" in the STATISTICS ANALYSIS,
           "boarding": the list of ids you found for "boarding" (fingerboard, campus board) in the STATISTICS ANALYSIS,
           "related": the list of ids you found for "climbing-related activities" from the STATISTICS ANALYSIS,
           "outdoor": the list of ids you found for "outdoor climbing" in the STATISTICS ANALYSIS,
           "other": the list of ids you found for "other sports" in the STATISTICS ANALYSIS,
           "injuries": the list of ids you found for "injuries" in the STATISTICS ANALYSIS,
           "expert": the text with your EXPPERT ANALYSIS summary goes here.
         }

         This is an EXAMPLE of a valid JSON object to be returned:

         {
           "bouldering": [123, 456],
           "rope": [123, 457],
           "boarding": [444, 555],
           "related": [888],
           "outdoor": [889],
           "other": [512, 257],
           "injuries": [538],
           "expert": "You had a busy month. You went bouldering with good regularity, and managed to push your grade from 6B+ to a consistent 7B. It is perhaps time to update your goals in bouldering since you have achieved them. You also did several other sports and managed to go climbing outdoors a few times and send one of your lead climbing projects. You kept doing some cardio exercises, which is very important for your overall endurance. It seems like your training is paying off, keep up the good job!"
         }
         
        `)

    prompt.push()

    const three_months_ago = Date.now() - (3 * 30 * 24 * 60 * 60 * 1000)

    if (data.length > 0) {
        let recent_activities_list = []
        for (const activity of data) {
            if (activity.completion_date >= three_months_ago) {
                recent_activities_list.push(build_one_activity(activity, recent_activities_list.length + 1))
            }
        }      
      if (recent_activities_list.length > 0) {
        prompt.push("These are the last " + recent_activities_list.length + " workouts the climber has performed:")
        prompt.push(recent_activities_list.join("\n"))

      }  
    }
    
    prompt.push("Please generate the JSON object with the STATISTICS ANALYSIS and your EXPERT ANALYSIS.")

    const final_prompt = prompt.join("\n")
    const result = await generate(final_prompt);
    const js = cleanJson(result)
    return js
  }