import { ActivityModel } from "./Activity"

test("can be created", () => {
  const instance = ActivityModel.create({})

  expect(instance).toBeTruthy()
})
