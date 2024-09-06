import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { UserBio, UserBioModel } from "./UserBio"
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
    clearBio() {
        this.setHistory('')
        this.setGoals('')
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
