import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TextStyle, View, TouchableOpacity } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, Icon } from "app/components"
import { spacing } from "../theme"
import { useStores } from "../models"
import { translate } from "../i18n"
import { GenerateReport } from "../services/llm";


// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ProgressScreenProps extends AppStackScreenProps<"Progress"> {}

export const ProgressScreen: FC<ProgressScreenProps> = observer(function ProgressScreen() {
  const { userBioStore, activityStore, performanceStore } = useStores()

  const [generateMessage, setGenerateMessage] = React.useState('');

  const MIN_ACTIVITIES = 5

  function activities_last_four_weeks() {
    const ONE_DAY_IN_MILIS = 24 * 60 * 60 * 1000
    const ONE_MONTH_IN_MILIS = ONE_DAY_IN_MILIS * 30

    const one_month_ago = Date.now() - ONE_MONTH_IN_MILIS

    let count = 0

    for (const act of activityStore.listOfActivities) {
      if (act.completion_date > one_month_ago) {
        count += 1
      }
    }
    return count
  }

  const maybeRenderNoActivities = () => {
    const activities_last_month = activities_last_four_weeks()
    if (activities_last_month < MIN_ACTIVITIES) {
      return(
        <View style={$errorsContainer}>
          <Text style={$errorMessage} tx="progressScreen.notEnoughActivities"/>
        </View>
      )
    }
    return(<></>)
  }
  
  const maybeRenderInviteToFillProfile = () => {
    const profile_full = userBioStore.bio.history.length > 0 && userBioStore.bio.goals.length > 0
    if (profile_full == true) {
      return (<></>)
    }
    return (
      <View style={$errorsContainer}>
        <Text style={$errorMessage} tx="progressScreen.fillYourProfile"/>
      </View>      
    )
  }

  const renderBox = (color: string, metric: number, category: string) => {
  return(
    <View style={{...$box, backgroundColor: color}}>
      <Text preset="bold" style={$metricText}>{metric}</Text>
      <Text preset="bold" style={$boxText}>{category}</Text>
    </View>
    )   
  }

  const maybeRenderReport = () => {
    const activities_last_month = activities_last_four_weeks()
    // Not enough data.
    if (activities_last_month < MIN_ACTIVITIES) { return (<></>) }
    // No report generated.
    if (performanceStore.report.when < 0) { return (<></>)}

    return (
      <View>
        <View>
          <Text preset="subheading" style={$reportTitle}>A summary of your sessions:</Text>
          <View style={$reportContainer}>
            {performanceStore.report.bouldering > 0 && (renderBox("#9dc1fa", performanceStore.report.bouldering, "boulder"))}
            {performanceStore.report.rope > 0 && (renderBox("#f5decb", performanceStore.report.rope, "rope climbing"))}
            {performanceStore.report.outdoor > 0 && (renderBox("#96c491", performanceStore.report.outdoor, "outdoor climbing"))}
            {performanceStore.report.related > 0 && (renderBox("#facaf8", performanceStore.report.rope, "related sports"))}
            {performanceStore.report.other > 0 && (renderBox("#f7b2bf", performanceStore.report.other, "other sports"))}
          </View>
        </View>

        <View style={$injuriesContainer}>
          {performanceStore.report.injuries > 0 && (
            <View>
              <View style={$injuriesBox}>
                <Icon icon="attention" color='red' size={35} style={{margin: 5}}/>
                <Text preset="subheading" style={$injuriesLabel}>Injuries reported</Text>
              </View>
              <Text style={$injuriesSubLabel}>You reported injuries or complained about pain {performanceStore.report.injuries} times in the last month.</Text>
            </View>

          )}
        </View>

        <Text preset="subheading" style={$expertTitle}>Expert analysis</Text>
        <View style={$expertContainer}>
          <Text style={$expertText}>
            {performanceStore.report.expert}
          </Text>
        </View>        
      </View>
    )
  }

  const maybeRenderRefresh = () => {
    const activities_last_month = activities_last_four_weeks()
    // Not enough data.
    if (activities_last_month < MIN_ACTIVITIES) { return (<></>) }

    return (
      <View>
        <TouchableOpacity
          style={$refreshStyle}
          onPress={async () => {
            if (generateMessage != '') {
              return
            }

            await performanceStore.clear()
            setGenerateMessage(translate("progressScreen.generatingAReport"))
            const report = await GenerateReport(activityStore.listOfActivities, userBioStore.bio.goals)
            const update = {
              "bouldering": report.bouldering?.length,
              "rope": report.rope?.length,
              "related": report.related?.length,
              "outdoor": report.outdoor?.length,
              "other": report.other?.length,
              "injuries": report.injuries,
              "expert": report.expert
            }
            await performanceStore.update(update)
            setGenerateMessage("")
          }}
        >
          <Icon icon="refresh" color='grey' size={30} style={{marginLeft: 20, padding: 5}}/>
        </TouchableOpacity>    

      </View>
    )
  }

  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <View style={$titleView}>
        <Text preset="heading" style={$title} tx="progressScreen.title"/>
        { maybeRenderRefresh() }
      </View>

      { maybeRenderInviteToFillProfile() }
      { maybeRenderNoActivities() }

      { generateMessage && <Text>{generateMessage}</Text>}

      { maybeRenderReport() } 

    </Screen>
  )
})

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $titleView: ViewStyle = {
  flexDirection: 'row',
  justityContent: 'space-around',
  alignItems: 'center'
}

const $title: TextStyle = {
  marginBottom: spacing.sm,
}

const $errorMessage: TextStyle = {
  margin: 10
}

const $errorsContainer: ViewStyle = {
  padding: 10,
  borderRadius: 10,
  backgroundColor: '#fab09d',
}

const $reportContainer: ViewStyle = {
  padding: 20,
  flexDirection: 'row',
  flexWrap: 'wrap',
  backgroundColor: '#f0eeed',
  borderRadius: 10,
}

const $reportTitle = {
  marginLeft: 5,
  marginVertical: 10,
}

const $refreshStyle = {
  borderRadius: 15,
  padding: 10,
  flexDirection: 'row',
  justifyContent: "center",
  alignItems: "center",
  shadowRadius: 2,
};

const $box = {
  width: '30%', // Adjust width as needed
  aspectRatio: 1, // Keep boxes square
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  margin: 5,
  borderRadius: 20,
  padding: 20,
};

const $boxText = {
  fontSize: 12,
  padding: 5,
  color: 'white',  
};

const $metricText = {
  fontSize: 20,
};

const $injuriesContainer: ViewStyle = {
  marginVertical: 20,
  padding: 5,
  flexDirection: 'row',
  justifyContent: 'flex-start',
}

const $injuriesBox: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
};

const $injuriesLabel = {

}

const $injuriesSubLabel = {
 fontSize: 13,
 padding: 10,
 color: 'grey'
};


const $expertContainer: ViewStyle = {
  padding: 10,
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  backgroundColor: '#f0eeed',
  borderRadius: 10,
  marginBottom: 20,
}

const $expertTitle = {
  marginBottom: 10,
  marginLeft: 5,
}

const $expertText = {
  fontSize: 13,
  color: 'grey'
}

