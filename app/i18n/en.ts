import demoEn from "./demo-en"

const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out",
  },
  welcomeScreen: {
    postscript:
      "psst  — This probably isn't what your app looks like. (Unless your designer handed you these screens, and in that case, ship it!)",
    readyForLaunch: "Your app, almost ready for launch!",
    exciting: "(ohh, this is exciting!)",
    letsGo: "Let's go!",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },

  errors: {
    invalidEmail: "Invalid email address.",
  },
  loginScreen: {
    logIn: "Log In",
    enterDetails:
      "Enter your details below.",
    emailFieldLabel: "Email",
    passwordFieldLabel: "Password",
    emailFieldPlaceholder: "Enter your email address",
    passwordFieldPlaceholder: "Super secret password here",
    tapToLogIn: "Tap to log in!",
    hint: "Hint: you can use any email address and your favorite password :)",
  },
  demoNavigator: {
    componentsTab: "Components",
    debugTab: "Debug",
    communityTab: "Community",
    podcastListTab: "Podcast",
    settingsTab: "About you",

  },
  demoSettingsScreen: {
    title: "Let's get to know yourself",
    tagLine:
      "Tell me about yourself and your climbing goals",
    climbingBio: "Your climbing biography",    
    climbingGoals: "Your climbing goals",
    healthInformation: "Injuries and/or health concerns",
    historyPlaceholder: "Add your biography here",
    goalsPlaceholder: "Add your climbing goals here",
    healthPlaceholder: "Enter information about injuries or any relevant health information",
    informationSaved: "All data saved",
    gradeSystem: "Grading system",
    usGradeSystem: "US",
    frenchGradeSystem: "French",

  },
  demoActivitiesScreen: {
    currentTrainingTitle: "This is your current training",
    currentTrainingFeedback: "Your feedback about this training",
    title: "Let's get some training in!",
    preferences: "Any preferences for today? Just type them below, then click Suggest Training",
    tagLine:
      "Tell me about yourself and your climbing goals",
    climbingBio: "Your climbing biography",    
    climbingGoals: "Your climbing goals",
    healthInformation: "Injuries and/or health concerns",
    feedback: "Add your feedback here",
    preferencesPlaceholder: "Enter your preferences for today's training. For example: I do not have a lot of time, just give me some ideas for fingerboarding at home",
    validateHistoryGoals: "Please visit the About You screen and insert your climbing history and goals. Then we can generate a training for you.",
    generatingTraining: "Generating a training for you",
    acceptTraining: "Let's do this!",
    suggestTraining: "Suggest training",
    markAsCompleted: "Mark as completed",
    cancelTrainingPlan: "Cancel training plan",
    adaptItLabel: "Adapt it",
    makeEasier: "Easier",
    makeHarder: "Harder",
    provideMeaningfulFeedback: "Please provide a meaningful feedback about this training",
  },
  historyScreen: {
    yourLogTitle: "Your training log",
    emptyActivities: "You do not have any activities yet.",
    notCompletedYet: "Not completed yet",
    completed: "Completed on",
    logManually: "Log an activity manually",
    whatDidYouDo: "Tell us about your training",
    whatDidYouDoPlaceholder: "Climbed 3 boulders in the 5C range, then sent a 6C for the first time",
    howDidYouFeel: "How did you feel after the training?",
    howDidYouFeelPlaceholder: "This was a very hard session, I had to skip the cool down because I did not have energy left",
    selectADate: "Select a date",
    noTrainingInFuture: "You cannot log a training in the future :)",
    provideMeaningfulDescriptionOfTheTrainingAndHowYouFeel: "Please provide a meaningful description and how you felt after the training",
    deleteAllTrainings: "Delete everything",
    detailedTrainingTitle: "Your selected training",
    detailedTrainingDate: "Date",
    detailedTrainingDescription: "The description of the training",
    detailedTrainingFeedback: "Your feedback about this training",
  },

  ...demoEn,
}

export default en
export type Translations = typeof en
