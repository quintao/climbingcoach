import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, TextStyle, View, TouchableOpacity } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, Icon } from "app/components"
import { spacing } from "../theme"
import { useStores } from "../models"
import { translate } from "../i18n"
import { GenerateReport } from "../services/llm";

interface ProgressScreenProps extends AppStackScreenProps<"Progress"> {}

export const ProgressScreen: FC<ProgressScreenProps> = observer(function ProgressScreen() {
  const { userBioStore, activityStore, performanceStore } = useStores()

  const [generateMessage, setGenerateMessage] = React.useState('');

  const [, forceUpdate] = React.useReducer(x => x + 1, 0)

  const MIN_ACTIVITIES = 1

  function activities_last_N_months(months: number) {
    const ONE_DAY_IN_MILIS = 24 * 60 * 60 * 1000
    const ONE_MONTH_IN_MILIS = ONE_DAY_IN_MILIS * 30
    const CUTOFF = months * ONE_MONTH_IN_MILIS

    const cutoff_ago = Date.now() - CUTOFF

    let count = 0

    for (const act of activityStore.listOfActivities) {
      if (act.completion_date > cutoff_ago) {
        count += 1
      }
    }
    return count
  }

  function has_enough_activities() {
    return activities_last_N_months(3) >= MIN_ACTIVITIES
  }

  const maybeRenderNoActivities = () => {
    if (!has_enough_activities()) {
      return(
        <View style={$errorsContainer}>
          <Text style={$errorMessage} tx="progressScreen.notEnoughActivities"/>
        </View>
      )
    }

    if (generateMessage != '') {
      return (<></>)
    }

    if (performanceStore.report.when < 0) {
      return (
        <View style={$expertContainer}>
          <Text style={$expertText}>
            Use the refresh button to generate your report.
          </Text>
        </View>)
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

  const renderBox = (color: string, opacity: number, metric: number, category: string) => {
  return(
    <View style={{...$box, backgroundColor: color, opacity: opacity}}>
      <Text preset="bold" style={$metricText}>{metric}</Text>
      <Text preset="bold" style={$boxText}>{category}</Text>
    </View>
    )   
  }

  function compute_totals() {
    let totals = {
      "ever": Math.max(0, activityStore.listOfActivities.length),
      "three_month": Math.max(0, activities_last_N_months(3)),
      "one_month": Math.max(0, activities_last_N_months(1))
    }
    return totals
  }

  const maybeRenderReport = () => {
    // No report generated.
    // color to save: f5decb
    const injury_frequency = performanceStore.report.injuries == 1 ? "once" : performanceStore.report.injuries + " times"
    const totals = compute_totals();

    return (
      <View>
        <View>
          <View style={$scoreBoardContainer}>
            <Icon icon="score" size={25} color='#ebcab0' style={{margin: 5}}/>
            <Text preset="subheading" style={$reportTitle}>Your activities</Text>
          </View>
          
          <View style={$reportContainer}>
            {renderBox("#0097b2", 0.9, Math.max(0, totals.one_month), "last 30 days")}
            {renderBox("#0097b2", 0.6, Math.max(totals.three_month, 0), "last 3 months")}
            {renderBox("#0097b2", 0.5, Math.max(totals.ever, 0), "total")}
          </View>
        </View>

        <View>
          <View style={$expertAnalyisTitlecontianer}>
              <Icon icon="summarize" color='#0097b2' size={25} style={{margin: 5}}/>
              <Text preset="subheading" style={$expertTitle}>Expert analysis</Text>
              { maybeRenderRefresh() }
            </View>
            { performanceStore.report.when > 0 && (
              <View style={$expertContainer}>
                <Text style={$expertText}>
                  {performanceStore.report.expert}
                </Text>
              </View>)}
              { maybeRenderNoActivities() }              
          </View>

          <View style={$injuriesContainer}>
              {performanceStore.report.injuries > 0 && (
                <View>
                  <View style={$injuriesBox}>
                    <Icon icon="attention" size={25} style={{margin: 5}}/>
                    <Text preset="subheading" style={$injuriesLabel}>Watch out</Text>
                  </View>
                  <Text style={$injuriesSubLabel}>You reported injuries or complained about pain {injury_frequency} recently.</Text>
                </View>

              )}
            </View>          
      </View>
    )
  }

  async function generateAndProcessReport() {
    await performanceStore.clear()
    setGenerateMessage(translate("progressScreen.generatingAReport"))
    const report = await GenerateReport(activityStore.listOfActivities, userBioStore.bio.goals)

    if (report.expert != '') {
      const update = {
        "expert": report.expert,
        "injuries": report.injuries
      }
      const combined_update = {...update}
      await performanceStore.update(combined_update)
    }
    setGenerateMessage("")
    forceUpdate()
  }

   const maybeRenderRefresh = () => {
    if (!has_enough_activities()) {
      return (<></>)
    }

    return (
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <TouchableOpacity
          style={$refreshStyle}
          onPress={async () => {
            if (generateMessage != '') {
              return
            }

            await generateAndProcessReport()
          }}
        >
          <Icon icon="refresh" color='grey' size={30}/>
        </TouchableOpacity>    

      </View>
    )
  }


  return (
    <Screen preset="scroll" contentContainerStyle={$container} safeAreaEdges={["top"]}>
      <View style={$titleView}>
        <Text preset="heading" style={$title} tx="progressScreen.title"/>
      </View>

      { maybeRenderInviteToFillProfile() }

      { maybeRenderReport() } 

      { generateMessage && <View style={$generateMessageView}>
          <Icon icon="timer" color='grey' size={40} style={{marginLeft: 20, padding: 5}}/>
          <Text style={$generateMessageTitle}>Generating your report</Text>
          <Text style={$generateMessageText}>This may take some time</Text>
        </View>
      }

    </Screen>
  )
})

const $container: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg,
}

const $titleView: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
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

const $scoreBoardContainer: ViewStyle = {
  flexDirection: 'row',
  marginVertical: 10,
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
}

const $refreshStyle = {
  borderRadius: 15,
  marginLeft: 10,
  flexDirection: 'row',
  justifyContent: "center",
  alignItems: "center",
};

const $box = {
  width: '30%', // Adjust width as needed
  aspectRatio: 1, // Keep boxes square
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexDirection: 'column',
  margin: 5,
  borderRadius: 20,
  padding: 10,
};

const $boxText = {
  fontSize: 10,
  padding: 3,
  color: 'black',
  textTransform: 'uppercase'
};

const $metricText = {
  fontSize: 20,
  fontWeight: 700,
};

const $injuriesContainer: ViewStyle = {
  marginVertical: 15,
  padding: 0,
  flexDirection: 'row',
  justifyContent: 'flex-start',
}

const $injuriesBox: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
};

const $injuriesLabel = {

};

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
  marginTop: 10,
}

const $expertAnalyisTitlecontianer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignContent: 'center',
  marginTop: 25,
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
  fontWeight: 700,
}