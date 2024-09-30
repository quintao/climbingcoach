import React, { FC } from "react"
import { TextStyle, View, ViewStyle, TextInput, Button } from "react-native"
import { Screen, Text } from "../components"
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

    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        <Text preset="heading" tx="demoSettingsScreen.title" style={$title} />
        <Text tx="demoSettingsScreen.tagLine" style={$tagline} /> 
        <Text style={{marginTop: 20, marginBottom: 10}} tx="demoSettingsScreen.climbingBio"/>
        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={handleHistoryChange}
          value={historyValue}
          style={{ height: 150, backgroundColor: '#E8F0FE', padding: 10  }}
          placeholder={userBioStore.bioInfo.history? userBioStore.bioInfo.history : translate("demoSettingsScreen.historyPlaceholder")}
        />

      <Text style={{marginTop: 20, marginBottom: 10}} tx="demoSettingsScreen.climbingGoals"/>
        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={handleGoalsChange}
          value={goalsValue}
          style={{ height: 150, backgroundColor: '#E8F0FE', padding: 10 }}
          placeholder={userBioStore.bioInfo.goals? userBioStore.bioInfo.goals : translate("demoSettingsScreen.goalsPlaceholder")}

        />

        <Text style={{marginTop: 20, marginBottom: 10}} tx="demoSettingsScreen.healthInformation"/>
        <TextInput
          multiline={true}
          numberOfLines={4}
          onChangeText={handleInjuriesValue}
          value={injuriesValue}
          style={{ height: 150, backgroundColor: '#E8F0FE', padding: 10 }}
          placeholder={userBioStore.bioInfo.injuries? userBioStore.bioInfo.injuries : translate("demoSettingsScreen.healthPlaceholder")}
        />         

      <View style={{margin: 10}}>
        <Button
          title="Save"
          onPress={() => {
            userBioStore.setHistory(historyValue)
            userBioStore.setGoals(goalsValue)
            userBioStore.setInjuries(injuriesValue)
            setConfirmationMessage(translate("demoSettingsScreen.informationSaved"))

            // Clear the message after 2 seconds
            setTimeout(() => {
              setConfirmationMessage('');
            }, 2000);
          }}
        />        
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