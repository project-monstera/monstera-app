import { averageValueFromList } from "./processing"

describe("[Processing] unit tests", () => {
  it("Should return the average value of a list of numbers", () => {
    const actualResult = averageValueFromList([1, 2, 3, 4, 5])
    const expectedResult = 3
    expect(actualResult).toEqual(expectedResult)
  })
})
