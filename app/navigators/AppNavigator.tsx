/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import * as Screens from "../screens"
import Config from "../config"
import { useStores } from "../models"
import { DemoNavigator, DemoTabParamList } from "./DemoNavigator"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Demo: NavigatorScreenParams<DemoTabParamList>
  // 🔥 Your screens go here
  Settings: undefined
	Activities: undefined
	History: undefined
	Progress: undefined,
  SetGoals: undefined,
  SetHistory: undefined,
	// IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const { userBioStore } = useStores()

  if (userBioStore.bioInfo.onboarding_started == false) {
    return (<Stack.Navigator
          screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DemoOnboadingIntro" component={Screens.OnboardingIntroScreen} />
    </Stack.Navigator>)
  }


  if (userBioStore.bioInfo.goals.trim() == "" || userBioStore.bioInfo.goals.trim().length <= 0) {
    return (<Stack.Navigator
          screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DemoSetGoals" component={Screens.SetGoalsScreen} />
    </Stack.Navigator>)
  }

  console.log(userBioStore.bioInfo.history.length)

  if (userBioStore.bioInfo.history.trim() == "" || userBioStore.bioInfo.history.trim().length <= 0) {
    return (<Stack.Navigator
          screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DemoSetHistory" component={Screens.SetHistoryScreen} />
    </Stack.Navigator>)
  }  


  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Demo"
    >

      <Stack.Screen name="Demo" component={DemoNavigator} />
      <Stack.Screen name="Progress" component={Screens.ProgressScreen} />
      <Stack.Screen name="DemoSettings" component={Screens.SettingsScreen} />
      <Stack.Screen name="DemoActivities" component={Screens.ActivitiesScreen} />
      <Stack.Screen name="DemoHistory" component={Screens.HistoryScreen} />

      </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
