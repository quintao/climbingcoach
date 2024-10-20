import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TextStyle, View, TouchableOpacity } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, Icon } from "app/components"
import { spacing } from "../theme"
import { useStores } from "../models"
import { translate } from "../i18n"
import { GenerateReport } from "../services/llm";
import { ImageBackground } from "react-native/types"


// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ProgressScreenProps extends AppStackScreenProps<"Progress"> {}

export const ProgressScreen: FC<ProgressScreenProps> = observer(function ProgressScreen() {
  const { userBioStore, activityStore, performanceStore } = useStores()

  const [generateMessage, setGenerateMessage] = React.useState('');

  const [, forceUpdate] = React.useReducer(x => x + 1, 0)

  const MIN_ACTIVITIES = 3

  function activities_last_three_months() {
    const ONE_DAY_IN_MILIS = 24 * 60 * 60 * 1000
    const ONE_MONTH_IN_MILIS = ONE_DAY_IN_MILIS * 30
    const THREE_MONTH_IN_MILIS = 3 * ONE_MONTH_IN_MILIS

    const one_month_ago = Date.now() - THREE_MONTH_IN_MILIS

    let count = 0

    for (const act of activityStore.listOfActivities) {
      if (act.completion_date > one_month_ago) {
        count += 1
      }
    }
    return count
  }

  function has_enough_activities() {
    return activities_last_three_months() >= MIN_ACTIVITIES
  }

  const maybeRenderNoActivities = () => {
    if (!has_enough_activities()) {
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

  const renderBox = (color: string, opacity: number, metric: number, category: string, ) => {
  return(
    <View style={{...$box, backgroundColor: color, opacity: opacity}}>
      <Text preset="bold" style={$metricText}>{metric}</Text>
      <Text preset="bold" style={$boxText}>{category}</Text>
    </View>
    )   
  }

  const maybeRenderReport = () => {
    if (!has_enough_activities()) {
    // Not enough data.
     return (<></>)
    }
    
    // No report generated.
    if (performanceStore.report.when < 0) { return (<></>)}

    const when = new Date(performanceStore.report.when)
    // color to save: f5decb

    return (
      <View>
        <View>
          <View style={$wheUpdated}>
            <Text style={$updatedLabel}>Report generated at {when.toLocaleString()}</Text>
          </View>

          <Text preset="subheading" style={$reportTitle}>A summary of your sessions:</Text>
          
          <View style={$reportContainer}>
            {performanceStore.report.bouldering > 0 && (renderBox("#0097b2", 1.0, performanceStore.report.bouldering, "boulder"))}
            {performanceStore.report.rope > 0 && (renderBox("#0097b2", 0.7, performanceStore.report.rope, "rope climbing"))}
            {performanceStore.report.boarding > 0 && (renderBox("#0097b2", 0.6, performanceStore.report.boarding, "finger"))}
            {performanceStore.report.outdoor > 0 && (renderBox("#0097b2", 0.5, performanceStore.report.outdoor, "outdoor climbing"))}
            {performanceStore.report.related > 0 && (renderBox("#0097b2", 0.4, performanceStore.report.rope, "related sports"))}
            {performanceStore.report.other > 0 && (renderBox("#ebcab0", 1.0, performanceStore.report.other, "other sports"))}
          </View>
        </View>

        <View style={$injuriesContainer}>
          {performanceStore.report.injuries > 0 && (
            <View>
              <View style={$injuriesBox}>
                <Icon icon="attention" size={25} style={{margin: 5}}/>
                <Text preset="subheading" style={$injuriesLabel}>Be careful</Text>
              </View>
              <Text style={$injuriesSubLabel}>You reported injuries or complained about pain {performanceStore.report.injuries} times in the last month.</Text>
            </View>

          )}
        </View>

        <View style={$expertAnalyisTitlecontianer}>
          <Icon icon="summarize" color='#0097b2' size={25} style={{margin: 5}}/>
          <Text preset="subheading" style={$expertTitle}>Expert analysis</Text>
        </View>
        <View style={$expertContainer}>
          <Text style={$expertText}>
            {performanceStore.report.expert}
          </Text>
        </View>        
      </View>
    )
  }

  async function generateAndProcessReport() {
    await performanceStore.clear()
    setGenerateMessage(translate("progressScreen.generatingAReport"))
    const report = await GenerateReport(activityStore.listOfActivities, userBioStore.bio.goals)
    const update = {
      "bouldering": report.bouldering?.length,
      "rope": report.rope?.length,
      "related": report.related?.length,
      "outdoor": report.outdoor?.length,
      "other": report.other?.length,
      "injuries": report.injuries?.length,
      "boarding": report.boarding?.length,
      "expert": report.expert
    }
    await performanceStore.update(update)
    setGenerateMessage("")
    forceUpdate()
  }

  const maybeRenderGenerateYourReport = () => {
    if (!has_enough_activities()) {
      return (<></>)
    }

    if (performanceStore.report.when > 0) {
      return (<></>)
    }
    return (
      <View>
        <TouchableOpacity
          style={$refreshStyle}
          onPress={async () => {

            if (generateMessage != '') {
              return
            }
            await generateAndProcessReport()

          }}
        >

          {generateMessage == '' && (
            <View style={$generateYourReportView}>
              <Text style={$generateYourReportText}>Generate your first report</Text>
            </View>
          )}
        </TouchableOpacity>    

      </View>
    )
  }

  const maybeRenderRefresh = () => {
    if (!has_enough_activities()) {
      return (<></>)
    }

    if (performanceStore.report?.when <= 0) {
      return (<></>)
    }

    return (
      <View>
        <TouchableOpacity
          style={$refreshStyle}
          onPress={async () => {
            if (generateMessage != '') {
              return
            }

            await generateAndProcessReport()
          }}
        >
          <Icon icon="refresh" color='grey' size={30} style={{marginLeft: 20, padding: 5}}/>
        </TouchableOpacity>    

      </View>
    )
  }


  // { generateMessage && <Text style={$generateMessageText}>{generateMessage}</Text>}
  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <View style={$titleView}>
        <Text preset="heading" style={$title} tx="progressScreen.title"/>
        { maybeRenderRefresh() }
      </View>

      { maybeRenderInviteToFillProfile() }
      { maybeRenderNoActivities() }

      { generateMessage && <View style={$generateMessageView}>
          <Icon icon="timer" color='grey' size={40} style={{marginLeft: 20, padding: 5}}/>
          <Text style={$generateMessageTitle}>Generating your report</Text>
          <Text style={$generateMessageText}>This may take some time</Text>
        </View>
      }

      { maybeRenderReport() } 
      { maybeRenderGenerateYourReport() } 


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

// logo color: 0097b2

const $errorsContainer: ViewStyle = {
  padding: 10,
  borderRadius: 10,
  backgroundColor: '#C2737C',
  margin: 10,
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

const $wheUpdated: ViewStyle = {
  margin: 10

}

const $updatedLabel = {
  fontSize: 13,
  color: 'grey'
 };

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
  color: 'black',

};

const $metricText = {
  fontSize: 20,
  color: '#38383b'
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

const $expertAnalyisTitlecontianer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignContent: 'center',
  marginBottom: 10,
}

const $expertTitle = {
}

const $expertText = {
  fontSize: 13,
  color: 'grey',
  padding: 10,
}

const $generateMessageView: ViewStyle = {
  padding: 10,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f0eeed',
  borderRadius: 10,
  marginBottom: 20,
}

const $generateMessageText = {
  fontSize: 15,
  color: '#C2737C',
  padding: 10,
}

const $generateMessageTitle = {
  fontSize: 15,
  color: '#C2737C',
  padding: 10,
  fontWeight: 'bold',
}

const $generateYourReportView = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#C2737C',
  padding: 10,
  borderRadius: 10,
}

const $generateYourReportText = {
  color: 'white',
  fontSize: 18,
  padding: 20
}