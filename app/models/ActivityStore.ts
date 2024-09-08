import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Activity, ActivityModel } from "./Activity"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { act } from "@testing-library/react-native"

export const ActivityStoreModel = types
  .model("ActivityStore")
  .props({
    log: types.array(ActivityModel),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    createNewActivity(workout: string) {
      console.log("Creating workrout!")
      const activity = ActivityModel.create({
        workout: workout,
        creation_date: Date.now(),
        id: Date.now()
      })
      console.log(activity)
      store.log.push(activity)
    },
    completeActivity(activity: Activity, comment: string) {
        if (store.log.includes(activity)) {
            activity.completion_date = Date.now()
            activity.feedback = comment
        }
    },
    removeAll() {
        store.log.clear()
    }
  }))
  .views((store) => ({
    get listOfActivities() {
        return store.log
    },
  }))
  .actions((store) => ({
  }))

export interface UserBioStore extends Instance<typeof ActivityStoreModel> {}
export interface UserBioStoreSnapshot extends SnapshotOut<typeof ActivityStoreModel> {}
