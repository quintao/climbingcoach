import React, { FC } from "react"
import { ImageStyle, TextStyle, View, ViewStyle, TextInput, Button, StyleSheet } from "react-native"
import { Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { useStores } from "../models"
import { act } from "@testing-library/react-native"
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from 'react-native-markdown-display';

// API key = AIzaSyCUGuL9nhMQ18wdFWhb943TM3Jjeee9BuQ


async function GenerateTraining(history: string, goals:string , activities: Array<string>, preferences: string) {
  const genAI = new GoogleGenerativeAI("AIzaSyCUGuL9nhMQ18wdFWhb943TM3Jjeee9BuQ");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let prompt = []

  const intro = "You're a climbing coach; you should help a rock climber who's trying to improve his climbing skills."
  prompt.push(intro)
  const context = "This is the context of the climber:  " + history
  prompt.push(context)
  const what_to_achieve = "This is what the climber is trying to achieve now: " + goals 
  prompt.push(what_to_achieve)
  
  if (activities.length > 0) {
    let recent_activities_list = []

    recent_activities_list.push("These are the last workouts the climber has performed:")
    for (const activity of activities) {
      recent_activities_list.push(activity)
    }
    prompt.push(recent_activities_list.join("\n"))
  } else {
    prompt.push("In terms of last workouts, the climber has not done much in the last days.")
    prompt.push("Take that into consideration when suggestion a workout: perhaps the climber needs a ramp-up phase.")
  }

  if (preferences) {
    prompt.push("For today, these are the preferences of the climber: " + preferences)
    prompt.push("You should respect the preferences of the climber, especially if they talk abou time.")
  }
  
  const target = `Please suggest a workout for the climber to do today.
  The workout should be aligned with the goal of the climber, the history, and what was mentioned in the last two workouts.
  You should only provide the workout plan, and no other information, introduction, etc. Please do not talk about the climber's history.

  When talking about lead climbing, use the French lead climbing grading system (6a, 6b, 7c+ etc). When talking about bouldering,
  use the french bouldering grading system (6A, 6B, 8B+).
  `
  prompt.push(target)
  const final_prompt = prompt.join("\n")

  console.log(final_prompt)

  const result = await model.generateContent(final_prompt);
  console.log(result.response.text());
  return result.response.text(); 
}

export const HistoryScreen: FC<DemoTabScreenProps<"DemoHistory">> =
  function HistoryScreen(_props) {
      const { userBioStore, activityStore } = useStores()

      const [confirmationMessage, setConfirmationMessage] = React.useState('');
      const [preferencesValue, setPreferences] = React.useState('');
      const [trainingValue, setTraining] = React.useState('');

    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        <Text preset="heading" style={$title}>Let's get some training in!</Text>

        <Text style={{marginTop: 20, marginBottom: 10}}>Any preferences for today? Just type them below, then click "Suggest training"</Text>
        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={setPreferences}
          value={preferencesValue}
          style={{ height: 75, backgroundColor: '#E8F0FE', padding: 10  }}
          placeholder={"Enter your preferences here for example: I do not have a lot of time, just give me some ideas for fingerboarding at home"}
        />

        <View style={{margin: 10}}>
          <Button
            title="Suggest training"
            onPress={async () => {
              setTraining('')
              setConfirmationMessage("Generating training ...")
              const activities = activityStore.listOfActivities;
              const training  = await GenerateTraining(
                userBioStore.bioInfo.history,
                userBioStore.bioInfo.goals,
                activities, preferencesValue);
              setConfirmationMessage("")                
              setTraining(training);
            }}
          />

      </View>

      <View>
        <Text>{confirmationMessage}</Text>
      </View>


      <View>
        <Markdown>{trainingValue}</Markdown>
        {trainingValue ? (
          <>
          <View style={{margin: 10}}>
            <Button title="Accept training"
            
            onPress={async () => {
              activityStore.createNewActivity(trainingValue)
              setTraining('')
              setConfirmationMessage("Training accepted for today")
              console.log(activityStore)
            }}            
            >
            </Button>
          </View>            
          </>) : <></>}        
      </View>


      </Screen>
    )
  }

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $title: TextStyle = {
  marginBottom: spacing.sm,
}

const $tagline: TextStyle = {
  marginBottom: spacing.xxl,
}

const $description: TextStyle = {
  marginBottom: spacing.lg,
}

const $sectionTitle: TextStyle = {
  marginTop: spacing.xxl,
}

const $logoContainer: ViewStyle = {
  marginEnd: spacing.md,
  flexDirection: "row",
  flexWrap: "wrap",
  alignContent: "center",
  alignSelf: "stretch",
}

const $logo: ImageStyle = {
  height: 38,
  width: 38,
}

const buttonStyle: ViewStyle = {
    marginTop: 20,
    backgroundColor: 'blue',
}
