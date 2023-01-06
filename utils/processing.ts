export const averageValueFromList = (list: number[]) =>
  list.reduce((acc, curr) => acc + curr, 0) / list.length
