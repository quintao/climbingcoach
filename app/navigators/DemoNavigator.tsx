import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps } from "@react-navigation/native"
import React from "react"
import { TextStyle, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { translate } from "../i18n"
import { SettingsScreen, ActivitiesScreen, HistoryScreen, ProgressScreen, SetGoalsScreen, SetHistoryScreen } from "../screens"
import { colors, spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"

export type DemoTabParamList = {
  DemoSettings: undefined
  DemoActivities: undefined
  DemoHistory: undefined,
  DemoProgress: undefined,
  DemoSetGoals: undefined,
  DemoSetHistory: undefined,
  DemoOnboardingIntro: undefined,
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<DemoTabParamList>()

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `DemoNavigator`.
 */
export function DemoNavigator() {
  const { bottom } = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >

    <Tab.Screen
        name="ProgressScreen"
        component={ProgressScreen}
        options={{
          tabBarLabel: translate("demoNavigator.progressScreen"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="home" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="DemoActivities"
        component={ActivitiesScreen}
        options={{
          tabBarLabel: "Generate training",
          tabBarIcon: ({ focused }) => (
            <Icon icon="mountain" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />     

    <Tab.Screen
        name="DemoHistory"
        component={HistoryScreen}
        options={{
          tabBarLabel: "Training log",
          tabBarIcon: ({ focused }) => (
            <Icon icon="trending" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />     

      <Tab.Screen
        name="DemoSettings"
        component={SettingsScreen}
        options={{
          tabBarLabel: translate("demoNavigator.settingsTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="settings" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      />

    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}
