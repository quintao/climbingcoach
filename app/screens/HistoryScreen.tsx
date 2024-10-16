import { observer } from "mobx-react-lite"
import React, { FC, useMemo } from "react"
import {
  Alert,
  Image,
  ImageSourcePropType,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
  TouchableOpacity, TextInput, Platform
} from "react-native"
import { type ContentStyle } from "@shopify/flash-list"
import {
  Card,
  ListView,
  Screen,
  Text,
  Icon
} from "../components"
import { translate } from "../i18n"
import { useStores } from "../models"
import { Activity } from "../models/Activity"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import { delay } from "../utils/delay"
import DateTimePicker from '@react-native-community/datetimepicker';
import Markdown from 'react-native-markdown-display';
import {shareAsync} from 'expo';
import * as FileSystem from 'expo-file-system'
import * as DocumentPicker from 'expo-document-picker';

const rnrImage1 = require("../../assets/images/demo/aititude-image-1.png")
const rnrImage2 = require("../../assets/images/demo/aititude-image-2.png")
const rnrImage3 = require("../../assets/images/demo/aititude-image-3.png")
const rnrImages = [rnrImage1, rnrImage2, rnrImage3]


export const HistoryScreen: FC<DemoTabScreenProps<"DemoHistory">> =
  function HistoryScreen(_props) {
    const { activityStore } = useStores()
    const [refreshing, setRefreshing] = React.useState(false)

    // For logging an activity manually.
    const [showModal, setShowModal] = React.useState(false)
    const [whatDidYouDo, setWhatDidYouDo] = React.useState("")
    const [howDidyouFeel, setHowDidYouFeel] = React.useState("")
    const [date, setDate] = React.useState(new Date());
    const [show, setShow] = React.useState(false);
    const [mode, setMode] = React.useState('date');
    const [errorMessage, setErrorMessage] = React.useState("")
    const [newEntriesUploaded, setNewEntriesUploaded] = React.useState(-1)

    // For showing the modal with the workout.
    const [detailedTraining, setDetailedTraining] = React.useState({})

    // To handle the management of settings
    const [expandSettings, setExpandSettings] = React.useState(false);

    function handleWhatDidYouDo(text: string) {
      setWhatDidYouDo(text)
      setErrorMessage('')
    }

    function handleHowDidYouFeel(text: string) {
      setHowDidYouFeel(text)
      setErrorMessage('')
    }

    // Hooks for the date picker.
    const onChange = (event: any, selectedDate: any) => {
      const currentDate = selectedDate;
      setShow(false);
      setDate(currentDate);
    };
  
    const showMode = (currentMode: string) => {
      setShow(true);
      setMode('date');
    };
  
    const showDatepicker = () => {
      showMode('date');
      setErrorMessage('')
    };

    async function manualRefresh() {
      setRefreshing(true)
      await Promise.all([activityStore.listOfActivities, delay(750)])
      setRefreshing(false)
    }

    // The activity logs to show on the screen.
    let data = activityStore.listOfActivities.slice()
    data.sort((a, b) => b.completion_date - a.completion_date);

    async function saveFile() {
      const directory = FileSystem.cacheDirectory;
      const path = directory + "/activities.json"
      if (Platform.OS === "android") {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    
        if (permissions.granted) {
          await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, "activities.json", "text")
            .then(async (path) => {
              await FileSystem.writeAsStringAsync(path, JSON.stringify(activityStore.log), { encoding: FileSystem.EncodingType.UTF8 });
            })
            .catch(e => console.log(e));
        } else {
          shareAsync(path);
        }
      } else {
        shareAsync(path);
      }
    }    

    const downloadJSON = async () => {
      try {
        saveFile()
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    };
    
    const confirmationButton = () => {
      Alert.alert(
        translate("historyScreen.deleteMessage"),
        translate("historyScreen.continueWithDeletion"),
        [
          {text: translate("historyScreen.cancel"),
            onPress: () => console.log("cancel"),
            style: 'Cancel'
          },
          {text: translate("historyScreen.continue"),
            onPress: () => {{
              activityStore.removeAll()
              setExpandSettings(false)
            }},
          },
        ]
      )
    }

    // renders the button to log activities by hand.
    const manageActivityLogs = () => {
      return (        
        <View style={{marginTop: 20}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity  style={{flexDirection: 'row', alignItems: 'center'}}
                 onPress={()=> { setExpandSettings(!expandSettings); setNewEntriesUploaded(-1)}}>
              <Icon icon="settings" color='gray' style={{margin: 5}}/>                  
              <Text style={{color: 'gray'}} tx="historyScreen.manageYourLogs"/>
            </TouchableOpacity>
          </View>

          {expandSettings &&
          <View style={{marginLeft: 10}}>
              <TouchableOpacity
                onPress={async () => {
                  setShowModal(true)
                }}
              >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Icon icon="menu" style={{margin: 5}} size={15}/>
                  <Text size="xxs" style={{color: 'gray'}} tx="historyScreen.logManually"/>
                </View>
              </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => confirmationButton()}
            >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon icon="bell" color='gray' style={{margin: 5}} size={15}/>                  
                <Text size="xxs" style={{color: 'gray'}} tx="historyScreen.deleteAllTrainings"/>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {downloadJSON()}}
            >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon icon="lock" color='gray' style={{margin: 5}} size={15}/>                  
                <Text size="xxs" style={{color: 'gray'}} tx="historyScreen.downloadYourData"/>
              </View>
            </TouchableOpacity>            

            <TouchableOpacity
              onPress={async () => {
                  const result = await DocumentPicker.getDocumentAsync(
                    {},
                  );
                  if (result.assets?.length <= 0) {
                    return;
                  }
                  
                  const current_number = activityStore.log.length
                  const content = await FileSystem.readAsStringAsync(result.assets[0].uri)
                  const json_content = JSON.parse(content)
                  for (const entry of json_content) {
                    activityStore.addActivityFromFile(entry)
                  }
                  const new_size = activityStore.log.length
                  if (new_size - current_number >= 0) {
                    setNewEntriesUploaded(new_size - current_number)
                  }
                }}
              >
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon icon="menu" color='gray' style={{margin: 5}} size={15}/>                  
                <Text size="xxs" style={{color: 'gray'}} tx="historyScreen.uploadYourData"/>
              </View>
            </TouchableOpacity>

            { newEntriesUploaded == 0 && <Text size="xxs" style={{color: 'red', padding: 5}} tx="historyScreen.noEntriesUploaded"/>}
            { newEntriesUploaded > 0 && <Text size="xxs" style={{color: 'green', padding: 5}}>{newEntriesUploaded} {translate("historyScreen.entriesUploaded")}</Text>}


          </View>
          }
      </View>
      )
    }

    function cleanState() {
      setWhatDidYouDo('')
      setHowDidYouFeel('')
      setErrorMessage('')
      setDate(new Date())
      setShowModal(false)
    }

    // Renders a modal screen with the detailed information about a past training.
    const renderDetailedCard = () => {
      return (
        <Screen
          preset="scroll"
          safeAreaEdges={["top"]}
          contentContainerStyle={$containerLogScreen}
        >

          <View style={$heading}>
            <View>
              <Text preset="heading" tx="historyScreen.detailedTrainingTitle"/>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginBottom: 20}}>
            <Text tx="historyScreen.detailedTrainingDate"/>
            <Text>: </Text>
            <Text>{new Date(detailedTraining.completion_date).toLocaleDateString()}</Text>
          </View>

          <View>
            <Text style={{marginBottom: 10}} tx="historyScreen.detailedTrainingDescription"/>
            <View style={{backgroundColor: 'white', borderRadius: 10, padding: 10}}>
              <Markdown
                style={{
                  body: {fontSize: 14, fontFamily: "sans-serif" }
                }}
              >{detailedTraining.workout}</Markdown>
            </View>
          </View>

          <View>
            <Text style={{marginVertical: 10}} tx="historyScreen.detailedTrainingFeedback"/>
            <View style={{backgroundColor: 'white', borderRadius: 10, padding: 10}}>
              <Text>{detailedTraining.feedback}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={{marginVertical: 20}}
            onPress={()=> setDetailedTraining({})}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon icon="back" color='gray' style={{margin: 5}}/>                  
                <Text>Back</Text>
              </View>
          </TouchableOpacity>
        </Screen>
    
      )
    }

    // The modal screen.
    if (showModal) {
      return (
        <Screen
          preset="fixed"
          safeAreaEdges={["top"]}
          contentContainerStyle={$containerLogScreen}
        >
           <View>
            <Text style={{marginTop: 20, marginBottom: 10}} tx="historyScreen.whatDidYouDo"/>
              <TextInput
                multiline={true}
                numberOfLines={4}
                onChangeText={handleWhatDidYouDo}
                value={whatDidYouDo}
                style={textInputStyle}
                placeholder={translate("historyScreen.whatDidYouDoPlaceholder")}
                placeholderTextColor="#d6d8da"          
              />
            <Text style={{marginTop: 20, marginBottom: 10}} tx="historyScreen.howDidYouFeel"/>
              <TextInput
                multiline={true}
                numberOfLines={4}
                onChangeText={handleHowDidYouFeel}
                value={howDidyouFeel}
                style={textInputStyle}
                placeholder={translate("historyScreen.howDidYouFeelPlaceholder")}
                placeholderTextColor="#d6d8da"          
              />

            <Text style={{marginTop: 20, marginBottom: 10}} tx="historyScreen.selectADate"/>

              <TouchableOpacity onPress={showDatepicker}>
                <TextInput
                  multiline={false}
                  editable={false}
                  style={textInputStyle}
                  value={date.toDateString()}>                
                </TextInput>
              </TouchableOpacity>
          
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  onChange={onChange}
                />
              )}

              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>

                <TouchableOpacity style={{padding: 10, backgroundColor: '#76a388', borderRadius: 10}}
                    onPress={async () => {
                      if (whatDidYouDo.length < 30 || howDidyouFeel.length < 10) {
                        setErrorMessage(translate("historyScreen.provideMeaningfulDescriptionOfTheTrainingAndHowYouFeel"))
                        return;
                      }
                      const now = Date.now()
                      if (date.getTime() > now) {
                        setErrorMessage(translate("historyScreen.noTrainingInFuture"))
                        return;
                      }
                      activityStore.addActivityManually(whatDidYouDo, howDidyouFeel, date)
                      cleanState()
                    }}
                  >
                  <Text style={touchableOpacityTextStyle} tx="historyScreen.save"/>
                  </TouchableOpacity>

                  <TouchableOpacity style={{padding: 10, backgroundColor: '#ff7a66', borderRadius: 10, marginLeft: 10}}
                    onPress={async () => {
                      cleanState()
                    }}
                  >
                    <Text style={touchableOpacityTextStyle} tx="historyScreen.cancel"/>
                  </TouchableOpacity>

              </View>

              <Text>{errorMessage}</Text>

           </View>
        </Screen>
      )
    }

    if (detailedTraining["id"] > 0) {
      return renderDetailedCard()
    }

    // The regular screen.
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
                { manageActivityLogs()}
              </View>
            }
            renderItem={({ item }) => (
              <WorkoutCard
                workout={item}
                onPressFavorite={() => {setDetailedTraining(item)}}
              />
            )}
            ListFooterComponent={<></>}
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
      const index = Math.floor(Math.random() * rnrImages.length)
      return rnrImages[index]
    }, [])
  
    const handlePressCard = () => {
      onPressFavorite()      
    }

    let completed = translate("historyScreen.notCompletedYet")
    if (workout.completion_date > 0) {
      completed = translate("historyScreen.completed") +  ' ' + new Date(workout.completion_date).toLocaleDateString()
    }

    let feedback = workout.feedback
    const MAX_FEEDBACK_LENGTH = 50
    if (feedback.length > MAX_FEEDBACK_LENGTH) {
      feedback = feedback.slice(0, MAX_FEEDBACK_LENGTH) + "..."
    }
  
    return (
      <Card
        style={$item}
        verticalAlignment="force-footer-bottom"
        onPress={handlePressCard}
        onLongPress={handlePressCard}
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
              <Text style={$metadataText} size="xxs">{feedback}</Text>
            ) : (<></>        
            )}
          </View>
        }
      />
    )
  })

const textInputStyle = {
    fontSize: 16,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FFF", // White background
    shadowColor: "#DDD",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2, // Adds a subtle shadow
    marginBottom: 20,
  };

const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $containerLogScreen: ViewStyle = {
  paddingTop: spacing.lg + spacing.xl,
  paddingHorizontal: spacing.lg
}

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const $heading: ViewStyle = {
  marginBottom: spacing.md
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

const touchableOpacityTextStyle = {
  color: "#FFF", // White text
  fontSize: 16,
  fontWeight: "bold",
};


// #endregion
