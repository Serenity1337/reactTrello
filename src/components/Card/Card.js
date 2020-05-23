import React, { useState, useEffect } from 'react'
import classes from './Card.module.scss'
import AddCardButton from '../AddCardButton'
import AddCard from '../AddCard'

export const Card = (props) => {
  const [cardFormState, setcardFormState] = useState(false)

  const [isCardEditing, setisCardEditing] = useState(false)

  const [cardEditState, setcardEditState] = useState('')

  const [startList, setstartList] = useState(Number)

  const [dragState, setdragState] = useState(Number)

  const [listInput, setlistInput] = useState('')

  const [isListEditing, setisListEditing] = useState(false)

  const [dash, setdash] = useState({})

  const [card, setcard] = useState({})

  useEffect(() => {
    setdash(props.dash.dash)
  }, [])
  const handleDragStart = (e, index) => {
    e.stopPropagation()
    const listObj = { ...props.list }
    props.setstartListIndex(props.listIndex)
    props.setstartCardIndex(index)
  }

  const handleDragEnter = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDragLeave = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e, index) => {
    e.preventDefault()
    e.stopPropagation()
    const dashClone = { ...props.dash.dash }
    const testObj = [...props.lists]
    const listObj = { ...props.list }

    const card = testObj[props.startListIndex].cards[props.startCardIndex]

    testObj[props.startListIndex].cards.splice(props.startCardIndex, 1)
    testObj[props.listIndex].cards.splice(index, 0, card)
    console.log(testObj)

    dashClone.lists = testObj
    props.setlists(testObj)

    const response = await fetch(
      'http://localhost:4000/dashboards/' + props.dash.dash.id,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dashClone),
      }
    )
    console.log(response)
  }

  const delCard = async (card) => {
    const dashClone = { ...props.dash.dash }
    console.log(dashClone)
    const listObj = { ...props.list }
    const cardsArr = listObj.cards.filter(
      (cardEntry) => cardEntry.id !== card.id
    )
    listObj.cards = cardsArr
    dashClone.lists[props.listIndex] = listObj
    const response = await fetch(
      'http://localhost:4000/dashboards/' + props.dash.dash.id,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dashClone),
      }
    )
    console.log(response)
    const testObj = [...props.lists]

    testObj[props.listIndex].cards = cardsArr
    console.log(testObj)
    props.setlists(testObj)
  }

  const listDel = async () => {
    const dashCopy = { ...props.dash.dash }
    const listsCopy = [...props.lists]
    const listsArr = listsCopy.filter(
      (listEntry) => props.list.id !== listEntry.id
    )
    dashCopy.lists = listsArr
    const response = await fetch(
      'http://localhost:4000/dashboards/' + props.dash.dash.id,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dashCopy),
      }
    )
    console.log(response)
    props.setlists(listsArr)
  }

  const toggleEdit = (card) => {
    card.isEditing = true
    setisCardEditing(true)
  }

  const formSubmitHandler = async (event, card, index) => {
    event.preventDefault()
    const dashClone = { ...props.dash.dash }

    const listClone = { ...props.list }
    const cardsClone = [...listClone.cards]
    cardsClone[index].cardName = cardEditState
    cardsClone[index].isEditing = false
    listClone.cards = cardsClone
    dashClone.lists[props.listIndex] = listClone
    const response = await fetch(
      'http://localhost:4000/dashboards/' + props.dash.dash.id,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dashClone),
      }
    )
    console.log(response)
    setisCardEditing(false)
  }

  const inputHandler = (event) => {
    setcardEditState(event.target.value)
  }

  const toggleFormHandler = (card) => {
    card.isEditing = false
    setisCardEditing(false)
  }

  const toggleListEdit = () => {
    props.list.isEditing = true
    setisListEditing(true)
  }

  const inputListHandler = (event) => {
    setlistInput(event.target.value)
  }
  const formListSubmitHandler = async (event) => {
    event.preventDefault()
    const dashCopy = { ...props.dash.dash }

    dashCopy.lists[props.listIndex].listName = listInput
    dashCopy.lists[props.listIndex].isEditing = false
    const response = await fetch(
      'http://localhost:4000/dashboards/' + props.dash.dash.id,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dashCopy),
      }
    )
    console.log(response)
    setisListEditing(false)
    const listClone = { ...props.list }
    listClone.listName = listInput
    listClone.isEditing = false
    const listsClone = [...props.lists]
    listsClone[props.listIndex] = listClone
    console.log(listsClone)
    props.setlists(listsClone)
  }
  return (
    <div className={classes.card} draggable>
      {!props.list.isEditing ? (
        <h1>
          {props.list.listName}
          <i className='fas fa-edit' onClick={toggleListEdit}></i>
          <i className='fas fa-times' onClick={listDel}></i>
        </h1>
      ) : (
        <form action='' onSubmit={(event) => formListSubmitHandler(event)}>
          <input
            className={classes.listName}
            name='listName'
            type='text'
            placeholder='enter new card name'
            onInput={inputListHandler}
            defaultValue={props.list.listName}
          />
        </form>
      )}

      {props.list.cards.map((card, index) =>
        !card.isEditing ? (
          <div
            className={classes.listDoCards}
            key={card.id}
            draggable
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnter={(e) => handleDragEnter(e, index)}
            onDragLeave={(e) => handleDragLeave(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragStart={(e) => handleDragStart(e, index)}
          >
            <div className={classes.doCard}>
              {' '}
              {card.cardName}{' '}
              <i className='fas fa-edit' onClick={() => toggleEdit(card)}></i>
              <i className='fas fa-trash' onClick={() => delCard(card)}>
                {' '}
              </i>
            </div>
          </div>
        ) : (
          <form
            action=''
            className={classes.newAddress}
            onSubmit={(event) => formSubmitHandler(event, card, index)}
            key={card.id}
          >
            <input
              className={classes.cardName}
              name='listName'
              type='text'
              placeholder='enter new card name'
              onChange={inputHandler}
              defaultValue={card.cardName}
            />
            <div className={classes.flexContainer}>
              <button type='submit' className={classes.submitBtn}>
                Add List
              </button>
              <div
                className={classes.cancelBtn}
                onClick={() => toggleFormHandler(card)}
              >
                <i className='fas fa-times'></i>
              </div>
            </div>
          </form>
        )
      )}
      {!cardFormState ? (
        <AddCardButton setcardFormState={setcardFormState}></AddCardButton>
      ) : (
        <AddCard
          setcardFormState={setcardFormState}
          list={props.list}
          lists={props.lists}
          setlists={props.setlists}
          listIndex={props.listIndex}
          dash={dash}
        ></AddCard>
      )}
    </div>
  )
}
