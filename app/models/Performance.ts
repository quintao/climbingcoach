import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const PerformanceModel = types
  .model("Performance")
  .props({
    when: -1,
    injuries: -1,
    expert: "",   
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Performance extends Instance<typeof PerformanceModel> {}
export interface PerformanceSnapshotOut extends SnapshotOut<typeof PerformanceModel> {}
export interface PerformanceSnapshotIn extends SnapshotIn<typeof PerformanceModel> {}
export const createPerformanceDefaultModel = () => types.optional(PerformanceModel, {})
