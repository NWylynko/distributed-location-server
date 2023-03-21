
type Location = {
  layer: number;
  row: number;
  column: number;
}

export const create3dMatrix = <ItemId extends string, Item extends { id: ItemId }>(width: number, height: number) => {
  type FullItem = (Item & Location) | undefined
  const items: FullItem[] = [];

  const createItem = (item: Item) => {
    return {
      ...item,
      layer: Math.floor(items.length / (width * height) + 1),
      row: Math.floor((items.length % (width * height)) / width + 1),
      column: Math.floor((items.length % (width * height)) % width + 1),
    }
  }

  const addItem = (item: Item) => {
    const fullItem = createItem(item)

    // either replace a instance that went down, or add to the end
    const existingEmptyItem = items.findIndex((item) => item === undefined)
    if (existingEmptyItem === -1) {
      items.push(fullItem);
    } else {
      items[existingEmptyItem] = fullItem
    }


    return fullItem;
  }

  const removeItem = (itemId: ItemId) => {
    // find the item in the array
    // set it to undefined
    const index = items.findIndex(item => item?.id === itemId);
    if (index !== -1) {
      items[index] = undefined;
    }
  }

  const getItems = () => items

  const getItem = (layer: number, row: number, column: number) => {
    return items[(layer - 1) * height * width + (row - 1) * width + (column - 1)]
  }

  const updateItem = (itemId: ItemId, updater: (oldState: FullItem) => FullItem) => {
    const index = items.findIndex(item => item?.id === itemId);
    const newState = updater(items[index])
    items[index] = newState;
    return newState;
  }

  return {
    getItems,
    addItem,
    removeItem,
    getItem,
    updateItem
  };
}