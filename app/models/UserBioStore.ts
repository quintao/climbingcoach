import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UserBioModel } from "./UserBio"
import { withSetPropAction } from "./helpers/withSetPropAction"

export const UserBioStoreModel = types
  .model("UserBioStore")
  .props({
    bio: types.optional(UserBioModel, {}),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    setHistory(history: string) {
      store.bio.history = history
    },
    setGoals(goals: string) {
      store.bio.goals = goals
    },
    setInjuries(injuries: string) {
        store.bio.injuries = injuries
    },
    setUseFrenchSystem(value: boolean) {
      store.bio.french_grading = value
    },
    clearBio() {
        this.setHistory('')
        this.setGoals('')
        this.setInjuries('')
    },
  }))
  .views((store) => ({
    get bioInfo() {
      return store.bio
    },
  }))
  .actions((store) => ({
  }))

export interface UserBioStore extends Instance<typeof UserBioStoreModel> {}
export interface UserBioStoreSnapshot extends SnapshotOut<typeof UserBioStoreModel> {}
