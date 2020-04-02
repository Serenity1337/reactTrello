import React, { useState, useEffect } from 'react'
import './App.css'
import AddList from './components/AddList'
import AddListButton from './components/AddListButton'
import Card from './components/Card'
import DND from './components/DND'

function App() {
  const [lists, setlists] = useState([])
  useEffect(() => {
    const fetchLists = async () => {
      const response = await fetch('http://localhost:4000/lists')
      const lists = await response.json()
      setlists(lists)
    }
    fetchLists()
  }, [])

  const [toggleListForm, settoggleListForm] = useState(false)

  const [dragListState, setdragListState] = useState(Number)

  const handleListDragStart = (e, listIndex) => {
    e.stopPropagation()
    console.log(listIndex)
    setdragListState(listIndex)
  }

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
    console.log(dragListState)
    console.log(listIndex)
    const listsArr = [...lists]

    let temp = listsArr[dragListState]
    listsArr[dragListState] = listsArr[listIndex]
    listsArr[listIndex] = temp
    console.log(listsArr)
    const response = await fetch(
      'http://localhost:4000/lists/' + listsArr[dragListState].id,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(listsArr[listIndex])
      }
    )
    const response2 = await fetch(
      'http://localhost:4000/lists/' + listsArr[listIndex].id,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(listsArr[dragListState])
      }
    )
    console.log(response)
    console.log(response2)
    setlists(listsArr)
  }
  return (
    <>
      <div className='flex'>
        {lists.map((list, listIndex) => (
          <div
            className='wrapper'
            key={list.id}
            onDragOver={e => handleListDragOver(e, listIndex)}
            onDragEnter={e => handleListDragEnter(e, listIndex)}
            onDragLeave={e => handleListDragLeave(e, listIndex)}
            onDrop={e => handleListDrop(e, listIndex)}
            onDragStart={e => handleListDragStart(e, listIndex)}
          >
            <Card
              list={list}
              listIndex={listIndex}
              key={list.id}
              lists={lists}
              setlists={setlists}
            ></Card>
          </div>
        ))}
        {toggleListForm ? (
          <AddList
            settoggleListForm={settoggleListForm}
            lists={lists}
            setlists={setlists}
          ></AddList>
        ) : (
          <AddListButton settoggleListForm={settoggleListForm}></AddListButton>
        )}
      </div>
    </>
  )
}

export default App
