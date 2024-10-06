import { observer } from "mobx-react-lite"
import React, { FC, useMemo } from "react"
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  TouchableOpacity
} from "react-native"
import { type ContentStyle } from "@shopify/flash-list"
import {
  Card,
  ListView,
  Screen,
  Text,
} from "../components"
import { translate } from "../i18n"
import { useStores } from "../models"
import { Activity } from "../models/Activity"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"

const rnrImage1 = require("../../assets/images/demo/aititude-image-1.png")
const rnrImage2 = require("../../assets/images/demo/aititude-image-2.png")
const rnrImage3 = require("../../assets/images/demo/aititude-image-3.png")
const rnrImages = [rnrImage1, rnrImage2, rnrImage3]


export const HistoryScreen: FC<DemoTabScreenProps<"DemoHistory">> =
  function HistoryScreen(_props) {
    const { activityStore } = useStores()
    const [refreshing, setRefreshing] = React.useState(false)

    async function manualRefresh() {
      setRefreshing(true)
      await Promise.all([activityStore.listOfActivities, delay(750)])
      setRefreshing(false)
    }

    let data = activityStore.listOfActivities.slice()
    data.sort((a, b) => b.creation_date - a.creation_date);


    return (
        <Screen
          preset="fixed"
          safeAreaEdges={["top"]}
          contentContainerStyle={$screenContentContainer}
        >

          <ListView<Activity>
            contentContainerStyle={$listContentContainer}
            data={data}
            refreshing={refreshing}
            estimatedItemSize={177}
            onRefresh={manualRefresh}
            ListHeaderComponent={
              <View style={$heading}>
                <View>
                  <Text preset="heading" tx="historyScreen.yourLogTitle"/>
                </View>
                <View>
                  {data.length == 0 && <Text tx="historyScreen.emptyActivities"/>}
                </View>
              </View>
            }
            renderItem={({ item }) => (
              <WorkoutCard
                workout={item}
                onPressFavorite={() => {}}
              />
            )}
            ListFooterComponent={
              <View style={{margin: 10}}>
              {data.length > 0 &&
                <TouchableOpacity
                  onPress={async () => {
                    activityStore.removeAll()
                  }}
                >
                <Text>Delete all</Text>
              </TouchableOpacity>
              }
            </View>
            }
          />

        </Screen>
      )
  }

  const WorkoutCard = observer(function WorkoutCard({
    workout,
    onPressFavorite,
  }: {
    workout: Activity
    onPressFavorite: () => void
  }) {
 
    const imageUri = useMemo<ImageSourcePropType>(() => {
      console.log()
      const index = Math.floor(Math.random() * rnrImages.length)
      console.log(index)
      return rnrImages[index]
    }, [])
  
  
    const handlePressFavorite = () => {
      // console.log("marking as completed.")
      // onPressFavorite()      
    }
  
    const handlePressCard = () => {
    }

    const creation_date = new Date(workout.creation_date);
    const formatted_creation_date = creation_date.toLocaleDateString();

    let completed = translate("historyScreen.notCompletedYet")
    if (workout.completion_date > 0) {
      completed = translate("historyScreen.completed") +  ' ' + new Date(workout.completion_date).toLocaleDateString()
    }
  
    return (
      <Card
        style={$item}
        verticalAlignment="force-footer-bottom"
        onPress={handlePressCard}
        onLongPress={handlePressFavorite}
        HeadingComponent={
          <View style={$metadata}>
            <Text
              style={$metadataText}
              size="xxs"
              accessibilityLabel={"whatever"}
            >
              {completed}
            </Text>
          </View>
        }
        RightComponent={<Image source={imageUri} style={$itemThumbnail} />}
        FooterComponent={
          <View>
            {workout.feedback != '' ? (
              <Text style={$metadataText} size="xxs">{workout.feedback}</Text>
            ) : (<></>        
            )}
          </View>
        }
      />
    )
  })



const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const $heading: ViewStyle = {
  marginBottom: spacing.md,
}

const $item: ViewStyle = {
  padding: spacing.md,
  marginTop: spacing.md,
  minHeight: 120,
}

const $itemThumbnail: ImageStyle = {
  marginTop: spacing.sm,
  borderRadius: 50,
  alignSelf: "flex-start",
}

const $metadata: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.xs,
  flexDirection: "row",
}

const $metadataText: TextStyle = {
  color: colors.textDim,
  marginEnd: spacing.md,
  marginBottom: spacing.xs,
}


// #endregion
