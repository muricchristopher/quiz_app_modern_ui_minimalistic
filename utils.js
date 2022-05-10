export const sortArray = (array) => {

    const createObjectWithSortedValue = array
    .map(data =>
    {
        return {
            name: data,
            sortValue: Math.random()
        }

    })

    const randomizeItemsPosition = createObjectWithSortedValue
    .sort((x,y) => x.sortValue - y.sortValue);

    const originalArraySorted = randomizeItemsPosition
    .map(data => data.name);

    return originalArraySorted

}

export const handleStatus = res =>
    res.ok ? res.json() : Promise.reject(res.statusText);
    //res está ok? se sim, transforme em json(), se não rejeite


export const log = param => {
  console.log(param);
  return param
}
