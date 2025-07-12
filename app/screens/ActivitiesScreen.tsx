import React, { FC } from "react"
import { TextStyle, View, ViewStyle, TextInput, TouchableOpacity } from "react-native"
import { Screen, Text, Icon } from "../components"
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

      // For some reason we need to force an update here.
      const [, forceUpdate] = React.useReducer(x => x + 1, 0)


      const renderScreenWithTrainingPlan = () => {
        return (
          <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
          <Text preset="heading" style={$title} tx="demoActivitiesScreen.currentTrainingTitle"/>

          <View>
            <Markdown
              style={{
                body: {fontSize: 14, fontFamily: "sans-serif" }
              }}
            >{activityStore.current.workout}</Markdown>
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
                if (feedbackValue.length < 15) {
                  handleConfirmationMessageChange(translate("demoActivitiesScreen.provideMeaningfulFeedback"))                
                  return;
                }

                activityStore.completeActivity(feedbackValue)
                handleFeedbackChange('')
                handleConfirmationMessageChange('')
              }}
            >
              <Text style={touchableOpacityTextStyle} tx="demoActivitiesScreen.markAsCompleted"/>
            </TouchableOpacity>
          </View> 

          <View style={{margin: 10}}>
            <TouchableOpacity
              style={cancelActivityStyle}
              onPress={async () => {
                await activityStore.cancelActivity()
                handleFeedbackChange('')
                handleConfirmationMessageChange('')
                forceUpdate()                
              }}
            >
              <Text style={touchableCancelActivityOpacityTextStyle} tx="demoActivitiesScreen.cancelTrainingPlan"/>
            </TouchableOpacity>
          </View>

          <View>
            <Text>{confirmationMessage}</Text>
          </View>

        </Screen>
        )
      }

      const renderForm = () => {
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

          {confirmationMessage && (
            <View style={{backgroundColor: '#f0eeed', borderRadius: 10, padding: 10, flexDirection: 'column', justifyContent: 'center', alignItems:'center'}}>
            <Icon icon="timer" color='grey' size={40} style={{marginLeft: 20, padding: 5}}/>
            <Text>{confirmationMessage}</Text>
          </View>
          )}

          <View>
            {trainingValue ? (
              <>
            <View style={{backgroundColor: '#e8e7e6', padding: 15, borderRadius: 20}}>
              <Markdown
                style={{
                  body: {fontSize: 14, fontFamily: "sans-serif" }
                }}>
                  {trainingValue}
              </Markdown>
            </View>              
              <View style={{margin: 25}}>
                <TouchableOpacity
                  style={acceptTrainingStyle}           
                  onPress={async () => {
                    await activityStore.acceptActivity(trainingValue)
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
          </Screen>)
        }

      if (activityStore.current.id <= 0 ) {
        return renderForm()
      }
      return renderScreenWithTrainingPlan()
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
  backgroundColor: "#53a5ad",
  opacity: 0.8,
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

const touchableCancelActivityOpacityTextStyle = {
  color: "#FFF", // White text
  fontSize: 13,
  fontWeight: "bold",
};

const acceptTrainingStyle = {
  backgroundColor: "#0097b2",
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
  backgroundColor: "#0097b2",
  borderRadius: 15,
  padding: 10,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#DDD",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
};

const cancelActivityStyle = {
  backgroundColor: "#cfd1d4",
  borderRadius: 15,
  padding: 5,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#DDD",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 1.0,
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