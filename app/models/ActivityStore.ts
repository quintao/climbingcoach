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
      const activity = ActivityModel.create({
        workout: workout,
        date: new Date().getMilliseconds().toString()
      })
      store.log.push(activity)
    },
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
