import React, { FC,useRef, useEffect, useState } from "react"
import { TextStyle, View, ViewStyle, TextInput, TouchableOpacity, Switch, Animated, Easing } from "react-native"
import { Screen, Text, Icon } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { spacing } from "../theme"
import { useStores } from "../models"
import { translate } from "../i18n"

const spinningImage = require("../../assets/images/adaptive-icon.png");

function SpinningImageComponent() {
  // Create an animated value
  const pulseValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Define the animation sequence for pulsing
        Animated.loop(
        Animated.sequence([
            // Animate from 0 to 1 (normal to slightly larger)
            Animated.timing(
            pulseValue,
            {
                toValue: 1,
                duration: 500, // Duration for scaling up
                easing: Easing.ease, // Smooth easing for the pulse
                useNativeDriver: true,
            }
            ),
            // Animate back from 1 to 0 (slightly larger back to normal)
            Animated.timing(
            pulseValue,
            {
                toValue: 0,
                duration: 500, // Duration for scaling down
                easing: Easing.ease, // Smooth easing for the pulse
                useNativeDriver: true,
            }
            ),
        ])
        ).start(); // Start the animation loop

    // Cleanup function
    return () => {
      pulseValue.stopAnimation(); // Stop the animation if the component unmounts
    };
  }, []); // Empty dependency array means this effect runs once on mount



    // Map the animated value (0 to 1) to a scale value (1.0 to 1.1)
const scale = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1.0, 1.1], // Scale from normal size (1.0) to 10% larger (1.1)
  });

  return (
    <View style={{backgroundColor: 'white', alignContent: 'center', justifyContent: 'center', flexDirection: 'column'}}>
      <Animated.Image
        style={[$image, { transform: [{ scale: scale }]  }]}
        source={spinningImage}
      />
      <Text style={{alignSelf: 'center', textTransform: 'uppercase', color: "#f5b482", fontWeight: 'bold', fontSize: 20}}>Personalizing</Text>
      <Text style={{alignSelf: 'center', textTransform: 'uppercase', color: "#53a5ad", fontSize: 14}}>your experience</Text>      
    </View>
  );
}



export const SetHistoryScreen: FC<DemoTabScreenProps<"DemoSetHistory">> =
  function SetHistoryScreen(_props) {
      const { userBioStore } = useStores()
      
      const [historyValue, setHistoryValue] = React.useState(userBioStore.bio.history);

      const handleHistoryChange = (text: string) => {
        setHistoryValue(text);
      };

     const [showSpin, setShowSpin] = React.useState(false)

     const [confirmationMessage, setConfirmationMessage] = React.useState('');

     if (showSpin) {
        return (
            <Screen preset="fixed"
                style={{backgroundColor: 'white'}}
                contentContainerStyle={{paddingTop: 100, alignItems: 'center', justifyContent: 'center'}}
                safeAreaEdges={["top"]}>
                <SpinningImageComponent/>
            </Screen>
        )
    }

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
            setShowSpin(true);                
            setTimeout(() => {
                setShowSpin(false)
                userBioStore.setHistory(trimmedValue)
            }, 6000);
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
  marginBottom: spacing.xxl,
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

const $image = {
    width: 400, // Set your desired width
    height: 400, // Set your desired height
    resizeMode: 'cover', // Or 'cover', 'stretch', etc.
}