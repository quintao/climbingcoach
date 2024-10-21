import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { PerformanceModel } from "./Performance"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const PerformanceStoreModel = types
  .model("PerformanceStore")
  .props({
    report: types.optional(PerformanceModel, {}),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    update(report: any) {
        store.report = report
        store.report.when = Date.now()
    },
    clear() {
        store.report = PerformanceModel.create({})
    },
  }))
  .views((store) => ({
  }))
  .actions((store) => ({
  }))

export interface PerformanceStore extends Instance<typeof PerformanceStoreModel> {}
export interface PerformanceStoreSnapshot extends SnapshotOut<typeof PerformanceStoreModel> {}
