import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Activity, ActivityModel } from "./Activity"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const ActivityStoreModel = types
  .model("ActivityStore")
  .props({
    log: types.array(ActivityModel),
    current: types.optional(ActivityModel, {})
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    acceptActivity(workout: string) {
      console.log("Creating workrout!")
      const activity = ActivityModel.create({
        workout: workout,
        creation_date: Date.now(),
        id: Date.now()
      })
      store.current = {...activity};
      console.log("Workout created")
    },
    completeActivity(comment: string) {
        console.log("Marking as completed")
        store.current.completion_date = Date.now()
        store.current.feedback = comment
        // Store a copy to avoid buggy references.
        const copy = { ...store.current };
        store.log.push(copy)
        store.current.id = -1
        store.current = {}
        console.log("Workout completed")
        console.log(store.current)
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
