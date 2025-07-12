import React, { FC } from "react"
import { TextStyle, View, ViewStyle, TextInput, TouchableOpacity, Switch } from "react-native"
import { Screen, Text, Icon } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { useStores } from "../models"
import { translate } from "../i18n"

export const SetHistoryScreen: FC<DemoTabScreenProps<"DemoSetHistory">> =
  function SetHistoryScreen(_props) {
      const { userBioStore } = useStores()
      
      const [historyValue, setHistoryValue] = React.useState(userBioStore.bio.history);

      const handleHistoryChange = (text: string) => {
        setHistoryValue(text);
      };

     const [confirmationMessage, setConfirmationMessage] = React.useState('');

    return (
      <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
        <Text preset="heading" style={$title}>What is your history with climbing?</Text>
        <Text style={$tagline}>Are you a beginner? Since when?</Text>
        <Text style={$tagline}>Have you been climbing for many years? Tell us what you have achieved so far!</Text>


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

      <View style={{margin: 20}}>
        <TouchableOpacity
          style={touchableOpacityStyle}
          onPress={() => {
            const trimmedValue = historyValue.trim();
            if (trimmedValue.length == 0) {
                setConfirmationMessage("You have to provide a climbing history.")
                return               
            }

            userBioStore.setHistory(trimmedValue)
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