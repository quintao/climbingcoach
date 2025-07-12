import React, { FC } from "react"
import { TextStyle, View, ViewStyle, TextInput, TouchableOpacity, Switch } from "react-native"
import { Screen, Text, Icon } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { useStores } from "../models"
import { translate } from "../i18n"

export const SetGoalsScreen: FC<DemoTabScreenProps<"DemoSetGoals">> =
  function SetGoalsScreen(_props) {
      const { userBioStore } = useStores()
      
      const [goalsValue, setGoalsValue] = React.useState(userBioStore.bio.goals);

      const handleGoalsChange = (text: string) => {
        setGoalsValue(text);
      };

     const [confirmationMessage, setConfirmationMessage] = React.useState('');

     const [, forceUpdate] = React.useReducer(x => x + 1, 0)
     

    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        <Text preset="heading" style={$title}>What are your climbing goals?</Text>
        <Text style={$tagline}>Do you want to climb a specific grade? When do you to achieve that?</Text>
        <Text style={$tagline}>Or perhaps you just want to keep your climbing fitness?</Text>
        <Text style={$tagline}>Just tell me what you want to achieve with AI'titude and we will personalize it for you.</Text>


        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10}}>
          <Icon icon="target" color={'#ebcab0'} size={25} style={{marginRight: 10}} />
          <Text preset="subheading" tx="demoSettingsScreen.climbingGoals"/>
        </View>
        <TextInput
          multiline={true}
          numberOfLines={10}
          onChangeText={handleGoalsChange}
          value={goalsValue}
          style={textInputStyle}
          placeholder={userBioStore.bioInfo.goals? userBioStore.bioInfo.goals : translate("demoSettingsScreen.goalsPlaceholder")}
          placeholderTextColor="#d6d8da"
        />

      <View style={{margin: 20}}>
        <TouchableOpacity
          style={touchableOpacityStyle}
          onPress={() => {
            const trimmedValue = goalsValue.trim();

            if (trimmedValue.length == 0) {
                setConfirmationMessage("You have to provide a climbing goal to use the app.")
                return               
            }

             userBioStore.setGoals(trimmedValue)
             setConfirmationMessage(translate("demoSettingsScreen.informationSaved"))

            // Clear the message after 2 seconds
            setTimeout(() => {
              setConfirmationMessage('');
              forceUpdate()
            }, 2000);
          }}
        ><Text style={touchableOpacityTextStyle}>Next</Text></TouchableOpacity>
      </View>
      <View>
        <Text>{confirmationMessage}</Text>
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
  marginBottom: spacing.lg,
}

const textInputStyle = {
  fontSize: 16,
  textColor: 'black',
  color: 'black',
  padding: 10,
  borderRadius: 5,
  backgroundColor: "white", // White background
  shadowRadius: 2, // Adds a subtle shadow
  marginBottom: 20,
  height: 120
};

const touchableOpacityStyle = {
  backgroundColor: "#53a5ad", // Primary color
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
  fontSize: 16
};