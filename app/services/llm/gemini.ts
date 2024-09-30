import { GoogleGenerativeAI } from "@google/generative-ai";
import Config from "react-native-config";

function build_one_activity(activity: any) {
    let activity_info = []
  
    const dd = new Date(activity.completion_date);
  
    activity_info.push("Workout completed on  " + dd.toLocaleDateString())
    activity_info.push(activity.workout)
    if (activity.feedback) {
      activity_info.push("Feedback from the climber about this workout:" + activity.feedback)
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
      
    const intro = "You're a climbing coach; you should help a rock climber who's trying to improve their climbing skills."
    prompt.push(intro)

    const how = "You will help the climbing by suggesting a training session."
    prompt.push(how)


    if (history != '') {
        const context = "This is the overall context provided by the climber with personal information and their history with the sport:  " + history
        prompt.push(context)
    }
  
    if (injuries != '') {
      const injueries_prompt = "This is relevant information about injuries and/or health concerns from the climber:  " + injuries
      prompt.push(injueries_prompt)
      prompt.push("You should make sure that the training you suggest does not make the injury worse.")
    } else {
        prompt.push("The climber does not report any injuries right now.")
    }
  
    if (goals != '') {
        const what_to_achieve = "These are the goals that the climber is trying to achieve now, using their own words: " + goals 
        prompt.push(what_to_achieve)
    }
    
    const seven_days_ago = Date.now() - (7 * 24 * 60 * 60 * 1000)
 
    if (activities.length > 0) {
      let recent_activities_list = []
      for (const activity of activities) {
        if (activity.completion_date > seven_days_ago) {
          recent_activities_list.push(build_one_activity(activity))
        }
      }

      if (recent_activities_list.length > 0) {
        prompt.push("These are the last workouts the climber has performed:")        
        prompt.push(recent_activities_list.join("\n"))
        prompt.push("You should take these last workouts when designing a workout for today.")
      }

    } else {
      prompt.push("In terms of last workouts, the climber has not done much in the last days.")
      prompt.push("Take that into consideration when suggesting a workout: perhaps the climber needs a ramp-up phase.")
    }
  
    if (preferences) {

      prompt.push("For today, these are the preferences of the climber: " + preferences)
      prompt.push("You should respect the preferences of the climber, especially if they talk about duration of the workout, and if the climber mentioned being tired.")
      prompt.push("If the climber mentions that they want to do a sport that is different from climbing, you should make sure that this sport does not negatively impact the climbing fitness of the climber.")
    }
    
    const target = `Please suggest a workout for the climber to do today.
    The workout should be aligned with the goal of the climber, the history, current injuries if they are mentioned, and the feedback provided by the climber for the last workouts.
    For example, if the last workouts felt very hard, you should make sure you suggest easier workouts. As a rule of thumb, the workouts you provide should not be very hard.

    You should only provide the workout plan, and no other information, introduction, etc. Please do not talk about the climber's history.
    `
    prompt.push(target)
    if (french_grading == true) {
        prompt.push(`When talking about lead climbing, use the French lead climbing grading system (6a, 6b, 7c+ etc). When talking about bouldering,
        use the french bouldering grading system (6A, 6B, 8B+).`)
    } else {
        prompt.push(`When talking about lead climbing, use the US lead climbing grading system (5.9, 5.10a, 5.12c etc). When talking about bouldering,
        use the V bouldering grading system (V0, V1, V10 etc).`)
    }
    
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
      
    const intro = "You're a climbing coach; You generated the training below but the climber found it too hard. Make it a little bit harder."
    prompt.push(intro)
    prompt.push(workout)
    prompt.push(`You should only provide the workout plan, and no other information, introduction, etc")
      When talking about lead climbing, use the French lead climbing grading system (6a, 6b, 7c+ etc). When talking about bouldering, use the french bouldering grading system (6A, 6B, 8B+).`)

    const final_prompt = prompt.join("\n")
    const result = await generate(final_prompt);
    return result
  }