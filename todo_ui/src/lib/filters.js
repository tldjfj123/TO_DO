export const FILTERS = Object.freeze(['all', 'active', 'done'])

export const applyFilter = (items = [], filter = 'all') => {
  if (!Array.isArray(items)) {
    return []
  }

  switch (filter) {
    case 'active':
      return items.filter((item) => !item.completed)
    case 'done':
      return items.filter((item) => item.completed)
    case 'all':
    default:
      return items.slice()
  }
}

export const remainingCount = (items = []) =>
  Array.isArray(items)
    ? items.reduce((acc, item) => acc + (item.completed ? 0 : 1), 0)
    : 0

