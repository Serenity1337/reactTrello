import React, { useState, useEffect, useRef, forceUpdate } from 'react'
import AddList from '../../components/AddList/index'
import AddListButton from '../../components/AddListButton/index'
import Card from '../../components/Card/index'
import classes from './Cards.module.scss'
export const Cards = (dash, dashIndex) => {
  const [lists, setlists] = useState([])

  const [toggleListForm, settoggleListForm] = useState(false)

  const [dragListState, setdragListState] = useState(Number)

  const [startListIndex, setstartListIndex] = useState(Number)

  const [startCardIndex, setstartCardIndex] = useState(Number)

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

    const listsArr = [...lists]
    const dashCopy = { ...dash.dash }

    let temp = listsArr[dragListState]
    listsArr[dragListState] = listsArr[listIndex]
    listsArr[listIndex] = temp
    dashCopy.lists = listsArr
    const response = await fetch(
      'http://localhost:4000/dashboards/' + dashCopy.id,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dashCopy),
      }
    )

    console.log(response)
    setlists(listsArr)
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
