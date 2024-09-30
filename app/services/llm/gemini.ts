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
  
  
  export async function GenerateTraining(history: string, goals: string, injuries: string, activities: any, preferences: string) {
    const apiKey = ""
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    let prompt = []
  
    const intro = "You're a climbing coach; you should help a rock climber who's trying to improve their climbing skills."
    prompt.push(intro)
    const context = "This is the overall context provided by the climber regarding their history with the sport:  " + history
    prompt.push(context)
  
    if (injuries != '') {
      const context = "This is relevant information about injuries and/or health concerns from the climber:  " + injuries
      prompt.push(context)
    }
  
    const what_to_achieve = "These are the goals that the climber is trying to achieve now, using their own words: " + goals 
    prompt.push(what_to_achieve)
    
    const seven_days_ago = Date.now() - 7 * 24 * 60 * 60
  
    if (activities.length > 0) {
      let recent_activities_list = []
  
      recent_activities_list.push("These are the last workouts the climber has performed:")
      for (const activity of activities) {
        if (activity.completion_date > seven_days_ago) {
          recent_activities_list.push(build_one_activity(activity))
        }
      }
      prompt.push(recent_activities_list.join("\n"))
    } else {
      prompt.push("In terms of last workouts, the climber has not done much in the last days.")
      prompt.push("Take that into consideration when suggestion a workout: perhaps the climber needs a ramp-up phase.")
    }
  
    if (preferences) {
      prompt.push("For today, these are the preferences of the climber: " + preferences)
      prompt.push("You should respect the preferences of the climber, especially if they talk about duration of the workout, and if the climber mentioned being tired.")
    }
    
    const target = `Please suggest a workout for the climber to do today.
    The workout should be aligned with the goal of the climber, the history, and the feedback provided by the climber for the last workouts.
    You should only provide the workout plan, and no other information, introduction, etc. Please do not talk about the climber's history.
  
    When talking about lead climbing, use the French lead climbing grading system (6a, 6b, 7c+ etc). When talking about bouldering,
    use the french bouldering grading system (6A, 6B, 8B+).
    `
    prompt.push(target)
    const final_prompt = prompt.join("\n")
    console.log(final_prompt)
    const result = await model.generateContent(final_prompt);
    return result.response.text(); 
  }