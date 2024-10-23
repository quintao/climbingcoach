import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const ActivityModel = types
  .model("Activity")
  .props({
    id: -1,
    creation_date: 0,
    completion_date: 0,
    workout: "",
    feedback: ""
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Activity extends Instance<typeof ActivityModel> {}
export interface ActivitySnapshotOut extends SnapshotOut<typeof ActivityModel> {}
export interface ActivitySnapshotIn extends SnapshotIn<typeof ActivityModel> {}
export const createActivityDefaultModel = () => types.optional(ActivityModel, {})
