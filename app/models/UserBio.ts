import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * Model description here for TypeScript hints.
 */
export const UserBioModel = types
  .model("UserBio")
  .props({
    history: "",
    goals: ""
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface UserBio extends Instance<typeof UserBioModel> {}
export interface UserBioSnapshotOut extends SnapshotOut<typeof UserBioModel> {}
export interface UserBioSnapshotIn extends SnapshotIn<typeof UserBioModel> {}
export const createUserBioDefaultModel = () => types.optional(UserBioModel, {})
