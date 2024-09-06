import { UserBioModel } from "./UserBio"

test("can be created", () => {
  const instance = UserBioModel.create({})

  expect(instance).toBeTruthy()
})
