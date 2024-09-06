import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const ActivityModel = types
  .model("Activity")
  .props({
    type: '',
    date: '', // Ex: 2022-08-12 21:05:36
    workout: ""
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Activity extends Instance<typeof ActivityModel> {}
export interface ActivitySnapshotOut extends SnapshotOut<typeof ActivityModel> {}
export interface ActivitySnapshotIn extends SnapshotIn<typeof ActivityModel> {}
export const createActivityDefaultModel = () => types.optional(ActivityModel, {})
