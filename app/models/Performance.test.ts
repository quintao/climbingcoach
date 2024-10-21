import { PerformanceModel } from "./Performance"

test("can be created", () => {
  const instance = PerformanceModel.create({})

  expect(instance).toBeTruthy()
})
