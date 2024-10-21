import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const PerformanceModel = types
  .model("Performance")
  .props({
    when: -1,
    bouldering: -1,
    rope: -1,
    related: -1,
    outdoor: -1,
    other: -1,
    injuries: -1,
    expert: "",
    boarding: -1,
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Performance extends Instance<typeof PerformanceModel> {}
export interface PerformanceSnapshotOut extends SnapshotOut<typeof PerformanceModel> {}
export interface PerformanceSnapshotIn extends SnapshotIn<typeof PerformanceModel> {}
export const createPerformanceDefaultModel = () => types.optional(PerformanceModel, {})
