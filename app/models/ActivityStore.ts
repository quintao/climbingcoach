import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Activity, ActivityModel } from "./Activity"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const ActivityStoreModel = types
  .model("ActivityStore")
  .props({
    log: types.array(ActivityModel),
    current: types.optional(ActivityModel, {id: -1})
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    acceptActivity(workout: string) {
      const activity = ActivityModel.create({
        workout: workout,
        creation_date: Date.now(),
        id: Date.now()
      })
      store.current = {...activity};
    },
    completeActivity(comment: string) {
        store.current.completion_date = Date.now()
        store.current.feedback = comment
        // Store a copy to avoid buggy references.
        const copy = { ...store.current };
        store.log.push(copy)
        store.current = ActivityModel.create({id: -1})
    },
    cancelActivity() {
      store.current.id = -1
      store.current = ActivityModel.create({id: -1})
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
