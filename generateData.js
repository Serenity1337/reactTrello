const { random } = require('faker')
const fs = require('fs')
generateLists = () =>
  [...Array(5)].map(() => ({
    id: random.uuid(),
    listName: random.words(5),
    cards: [...Array(5)].map(() => ({
      cardName: random.words(10),
    })),
  }))

module.exports = () => {
  const lists = { lists: [], users: [], dashboards: [] }
  fs.writeFileSync('./db.json', JSON.stringify(lists, null, 2))
  return lists
}
