import React, { FC } from "react"
import { TextStyle, View, ViewStyle, TextInput, TouchableOpacity, Switch } from "react-native"
import { Screen, Text, Icon } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { useStores } from "../models"
import { translate } from "../i18n"

export const SettingsScreen: FC<DemoTabScreenProps<"DemoSettings">> =
  function SettingsScreen(_props) {
      const { userBioStore } = useStores()
      
      const [historyValue, setHistoryValue] = React.useState(userBioStore.bio.history);

      const handleHistoryChange = (text: string) => {
        setHistoryValue(text);
      };

      const [goalsValue, setGoalsValue] = React.useState(userBioStore.bio.goals);

      const handleGoalsChange = (text: string) => {
        setGoalsValue(text);
      };

      const [injuriesValue, setInjuriesValue] = React.useState(userBioStore.bio.injuries);

      const handleInjuriesValue = (text: string) => {
        setInjuriesValue(text);
      };

     const [confirmationMessage, setConfirmationMessage] = React.useState('');

     const [isFrenchGrading, setFrenchGrading] = React.useState(userBioStore.bio.french_grading);

    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        <Text preset="heading" tx="demoSettingsScreen.title" style={$title} />
        <Text tx="demoSettingsScreen.tagLine" style={$tagline} />

        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10}}>
          <Icon icon="biography" color={'#0097b2'} size={25} style={{marginRight: 10}} />
          <Text preset="subheading" tx="demoSettingsScreen.climbingBio"/>
        </View>
        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={handleHistoryChange}
          value={historyValue}
          style={textInputStyle}
          placeholder={userBioStore.bioInfo.history? userBioStore.bioInfo.history : translate("demoSettingsScreen.historyPlaceholder")}
          placeholderTextColor="#d6d8da"
        />

        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10}}>
          <Icon icon="target" color={'#ebcab0'} size={25} style={{marginRight: 10}} />
          <Text preset="subheading" tx="demoSettingsScreen.climbingGoals"/>
        </View>
        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={handleGoalsChange}
          value={goalsValue}
          style={textInputStyle}
          placeholder={userBioStore.bioInfo.goals? userBioStore.bioInfo.goals : translate("demoSettingsScreen.goalsPlaceholder")}
          placeholderTextColor="#d6d8da"
        />

        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10}}>
          <Icon icon="medical" color={'#C2737C'} size={25} style={{marginRight: 10}} />
          <Text preset="subheading" tx="demoSettingsScreen.healthInformation"/>
        </View>
        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={handleInjuriesValue}
          value={injuriesValue}
          style={textInputStyle}
          placeholder={userBioStore.bioInfo.injuries? userBioStore.bioInfo.injuries : translate("demoSettingsScreen.healthPlaceholder")}
          placeholderTextColor="#d6d8da"          
        />

        <View>
          <Text style={{marginTop: 20, marginBottom: 10}} tx="demoSettingsScreen.gradeSystem"/>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{marginTop: 20, marginBottom: 10}} tx="demoSettingsScreen.usGradeSystem"/>
            <Switch
              trackColor={{ false: "#0097b2", true: "#668cff" }}
              thumbColor={isFrenchGrading ? "#ebcab0" : "#5757f2"}
              onValueChange={setFrenchGrading}
              value={isFrenchGrading}
            />
            <Text style={{marginTop: 20, marginBottom: 10}} tx="demoSettingsScreen.frenchGradeSystem"/>
          </View>                 
        </View>

      <View style={{margin: 10}}>
        <TouchableOpacity
          style={touchableOpacityStyle}
          onPress={() => {
            userBioStore.setHistory(historyValue)
            userBioStore.setGoals(goalsValue)
            userBioStore.setInjuries(injuriesValue)
            userBioStore.setUseFrenchSystem(isFrenchGrading)
            setConfirmationMessage(translate("demoSettingsScreen.informationSaved"))

            // Clear the message after 2 seconds
            setTimeout(() => {
              setConfirmationMessage('');
            }, 2000);
          }}
        ><Text style={touchableOpacityTextStyle}>Save</Text></TouchableOpacity>
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
  marginBottom: spacing.xxl,
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
};

const touchableOpacityStyle = {
  backgroundColor: "#363E46", // Primary color
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