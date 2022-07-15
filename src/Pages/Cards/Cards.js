import React, { useState, useEffect, useContext } from 'react'
import AddList from '../../components/AddList/index'
import AddListButton from '../../components/AddListButton/index'
import Card from '../../components/Card/index'
import { UserContext } from '../../UserContext'
import classes from './Cards.module.scss'
export const Cards = (dash, dashIndex) => {
  const [lists, setlists] = useState([])

  const { user, setuser } = useContext(UserContext)

  const [toggleListForm, settoggleListForm] = useState(false)

  const [dragListState, setdragListState] = useState(null)

  const [startListIndex, setstartListIndex] = useState(null)

  const [startCardIndex, setstartCardIndex] = useState(null)

  const checkIfLoggedIn = () => {
    if (!user) {
      window.location.href = '/login'
    }
  }
  checkIfLoggedIn()

  const handleListDragStart = (e, listIndex) => {
    e.stopPropagation()
    setdragListState(listIndex)
  }
  useEffect(() => {
    setlists(dash.dash.lists)
  }, [])
  const handleListDragEnter = (e, listIndex) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleListDragLeave = (e, listIndex) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleListDragOver = (e, listIndex) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleListDrop = async (e, listIndex) => {
    e.preventDefault()
    e.stopPropagation()
    if (
      startListIndex === null &&
      startCardIndex === null &&
      lists[listIndex].length !== 0
    ) {
      const listsArr = [...lists]
      const dashCopy = { ...dash.dash }

      let temp = listsArr[dragListState]
      listsArr[dragListState] = listsArr[listIndex]
      listsArr[listIndex] = temp
      dashCopy.lists = listsArr
      const response = await fetch(
        `https://copytrelloapi.herokuapp.com/trello/trellodash/editdash/${dash.dash._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dashCopy),
        }
      )

      setlists(listsArr)
    } else {
      const dashClone = { ...dash.dash }
      const testObj = [...lists]

      const card = testObj[startListIndex].cards[startCardIndex]

      testObj[startListIndex].cards.splice(startCardIndex, 1)
      testObj[listIndex].cards.push(card)

      dashClone.lists = testObj
      setlists(testObj)

      const response = await fetch(
        `https://copytrelloapi.herokuapp.com/trello/trellodash/editdash/${dash.dash._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dashClone),
        }
      )
      setstartCardIndex(null)
      setstartListIndex(null)
    }
  }

  return (
    <div className={classes.flexVHWidth}>
      {lists.map((list, listIndex) => (
        <div
          className={classes.wrapper}
          key={list.id}
          onDragOver={(e) => handleListDragOver(e, listIndex)}
          onDragEnter={(e) => handleListDragEnter(e, listIndex)}
          onDragLeave={(e) => handleListDragLeave(e, listIndex)}
          onDrop={(e) => handleListDrop(e, listIndex)}
          onDragStart={(e) => handleListDragStart(e, listIndex)}
        >
          <Card
            list={list}
            listIndex={listIndex}
            key={list.id}
            lists={lists}
            setlists={setlists}
            dash={dash}
            setstartListIndex={setstartListIndex}
            startListIndex={startListIndex}
            startCardIndex={startCardIndex}
            setstartCardIndex={setstartCardIndex}
          ></Card>
        </div>
      ))}
      {toggleListForm ? (
        <AddList
          settoggleListForm={settoggleListForm}
          lists={lists}
          setlists={setlists}
          dashIndex={dashIndex}
          dash={dash}
        ></AddList>
      ) : (
        <AddListButton settoggleListForm={settoggleListForm}></AddListButton>
      )}
    </div>
  )
}
