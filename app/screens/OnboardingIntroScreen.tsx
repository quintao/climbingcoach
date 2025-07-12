import React, { FC } from "react"
import { TextStyle, View, ViewStyle, TouchableOpacity, Image } from "react-native"
import { Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { useStores } from "../models"


export const OnboardingIntroScreen: FC<DemoTabScreenProps<"DemoOnboardingIntro">> =
  function OnboardingIntroScreen(_props) {
 
    const { userBioStore } = useStores()

    return (
      <Screen preset="auto" style={{backgroundColor: 'white'}} contentContainerStyle={$container} safeAreaEdges={["top"]}>
        <Text preset="heading" style={$title}>Welcome to AI'titude</Text>


        <Image source={require("../../assets/images/adaptive-icon.png")} style={$image}></Image>

        <Text style={$tagline}>In the next screens we will ask you some questions to personalize your experience.</Text>

        <Text style={$tagline}>It will take no more than 2 minutes of your time. We promise!</Text>


      <View style={{margin: 20}}>
        <TouchableOpacity
          style={touchableOpacityStyle}
          onPress={() => {
            userBioStore.setOnboardingStarted(true)
          }}
        ><Text style={touchableOpacityTextStyle}>Let's go!</Text></TouchableOpacity>
      </View>

      </Screen>
    )
  }

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
  backgroundColor: 'white',
  alignItems: 'center'
}

const $title: TextStyle = {
  marginBottom: spacing.xl,
}

const $tagline: TextStyle = {
  marginBottom: spacing.xxl,
}

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
  width: 300
};

const touchableOpacityTextStyle = {
  color: "#FFF", // White text
  fontSize: 16
};

const $image = {
    width: 200, // Set your desired width
    height: 200, // Set your desired height
    resizeMode: 'contain', // Or 'cover', 'stretch', etc.
    
}