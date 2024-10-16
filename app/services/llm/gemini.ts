import { GoogleGenerativeAI } from "@google/generative-ai";

function build_one_activity(activity: any, index: number) {
    let activity_info = []
  
    const dd = new Date(activity.completion_date);
  
    activity_info.push("\n\nWorkout #" + index +", completed on  " + dd.toDateString())
    activity_info.push(activity.workout)
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
    console.log(final_prompt)
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