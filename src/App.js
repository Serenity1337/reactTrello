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

  return (
    <>
      <div className='flex'>
        {lists.map((list, listIndex) => (
          <div className='wrapper' key={list.id}>
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
