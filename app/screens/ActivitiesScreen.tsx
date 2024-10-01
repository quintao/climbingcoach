import React, { FC } from "react"
import { TextStyle, View, ViewStyle, TextInput, TouchableOpacity } from "react-native"
import { Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { useStores } from "../models"
import { GenerateTraining, MakeItEasier, MakeItHarder } from "../services/llm";
import Markdown from 'react-native-markdown-display';
import { translate } from "../i18n"

export const ActivitiesScreen: FC<DemoTabScreenProps<"DemoActivities">> =
  function ActitiviesScreen(_props) {
      const { userBioStore, activityStore } = useStores()

      const [confirmationMessage, setConfirmationMessage] = React.useState('');

      const handleConfirmationMessageChange = (text: string) => {
        setConfirmationMessage(text);
      };

      const [preferencesValue, setPreferences] = React.useState('');

      const handlePreferencesChange = (text: string) => {
        setPreferences(text);
      };

      const [trainingValue, setTraining] = React.useState('');

      const handleTrainingChange = (text: string) => {
        setTraining(text);
      };

      const [feedbackValue, setFeedback] = React.useState('');

      const handleFeedbackChange = (text: string) => {
        setFeedback(text);
      };

    if (activityStore.current.id > 0) {
      return(
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        <Text preset="heading" style={$title} tx="demoActivitiesScreen.currentTrainingTitle"/>

        <View>
          <Markdown>{activityStore.current.workout}</Markdown>
        </View>


        <Text style={{marginTop: 20, marginBottom: 10}} tx="demoActivitiesScreen.currentTrainingFeedback"/>
        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={handleFeedbackChange}
          value={feedbackValue}
          style={textInputStyle}
          placeholder={translate("demoActivitiesScreen.feedback")}
          placeholderTextColor="#d6d8da"          
        /> 

        <View style={{margin: 10}}>
          <TouchableOpacity
            style={markAsCompletedStyle}
            onPress={async () => {
              activityStore.completeActivity(feedbackValue)
              handleFeedbackChange('')
            }}
          >
            <Text style={touchableOpacityTextStyle} tx="demoActivitiesScreen.markAsCompleted"/>
          </TouchableOpacity>
        </View>        
      </Screen>
      )      
    }
      
    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        <Text preset="heading" style={$title} tx="demoActivitiesScreen.title" />

        <Text style={{marginTop: 20, marginBottom: 10}} tx="demoActivitiesScreen.preferences" />
        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={handlePreferencesChange}
          value={preferencesValue}
          style={textInputStyle}
          placeholder={translate("demoActivitiesScreen.preferencesPlaceholder")}
          placeholderTextColor="#d6d8da"
        />

        <View style={{margin: 10}}>
          <TouchableOpacity 
            style={touchableOpacityStyle}           
            onPress={async () => {
              handleConfirmationMessageChange("")                

              if (userBioStore.bioInfo.history == '' || userBioStore.bioInfo.goals == '') {
                handleConfirmationMessageChange(translate("demoActivitiesScreen.validateHistoryGoals"))
                return;
              }

              handleTrainingChange('')
              handleConfirmationMessageChange(translate("demoActivitiesScreen.generatingTraining"))
              const activities = activityStore.listOfActivities;
              const training  = await GenerateTraining(
                userBioStore.bioInfo.history,
                userBioStore.bioInfo.goals,
                userBioStore.bioInfo.injuries,
                userBioStore.bioInfo.french_grading,
                activities, preferencesValue);
                handleConfirmationMessageChange("")                
                handleTrainingChange(training);
            }}
          ><Text style={touchableOpacityTextStyle} tx="demoActivitiesScreen.suggestTraining"/></TouchableOpacity>
        </View>

      <View>
        <Text>{confirmationMessage}</Text>
      </View>


      <View>
        <Markdown>{trainingValue}</Markdown>
        {trainingValue ? (
          <>
          <View style={{margin: 25}}>
            <TouchableOpacity
              style={acceptTrainingStyle}           
              onPress={async () => {
                activityStore.acceptActivity(trainingValue)
                setTraining('')
              }}            
            >
            <Text style={touchableOpacityTextStyle} tx={"demoActivitiesScreen.acceptTraining"}/>
            </TouchableOpacity>
            
            <View style={{margin: 20}}>
              <Text tx={"demoActivitiesScreen.adaptItLabel"}/>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text tx={"demoActivitiesScreen.makeEasier"}/>
              <TouchableOpacity style={controlButtons}
               onPress={async () => {
                handleTrainingChange('')
                handleConfirmationMessageChange(translate("demoActivitiesScreen.generatingTraining"))
                const training  = await MakeItEasier(trainingValue);
                handleConfirmationMessageChange("")                
                handleTrainingChange(training);
              }}>
                <Text>-</Text>
              </TouchableOpacity>
              <Text>x</Text>              
              <TouchableOpacity style={controlButtons}
               onPress={async () => {
                handleTrainingChange('')
                handleConfirmationMessageChange(translate("demoActivitiesScreen.generatingTraining"))
                const training  = await MakeItHarder(trainingValue);
                handleConfirmationMessageChange("")                
                handleTrainingChange(training);
              }}>
                <Text>+</Text>
              </TouchableOpacity>
              <Text tx={"demoActivitiesScreen.makeHarder"}/>         
            </View>            
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


const textInputStyle = {
  fontSize: 16,
  padding: 10,
  borderRadius: 5,
  backgroundColor: "#FFF", // White background
  shadowColor: "#DDD",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2, // Adds a subtle shadow
  marginBottom: 20,
};

const touchableOpacityStyle = {
  backgroundColor: "#363E46",
  borderRadius: 15,
  padding: 10,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#DDD",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
};

const touchableOpacityTextStyle = {
  color: "#FFF", // White text
  fontSize: 16,
  fontWeight: "bold",
};


const acceptTrainingStyle = {
  backgroundColor: "#ff7a66",
  borderRadius: 15,
  padding: 10,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#DDD",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
};

const markAsCompletedStyle = {
  backgroundColor: "#76a388",
  borderRadius: 15,
  padding: 10,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#DDD",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
};

const controlButtons = {
  backgroundColor: "#bec2bf",
  margin: 10,
  width: 30,
  height: 30,
  border: "1px solid #ccc", /* Adjust border color and width as needed */
  borderRadius: 0, /* Remove rounded corners for a square shape */
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 15
};