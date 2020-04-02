import React, { useState, useEffect } from 'react'
import classes from './Card.module.scss'
import AddCardButton from '../AddCardButton'
import AddCard from '../AddCard'

export const Card = props => {
  const [cardFormState, setcardFormState] = useState(false)

  const [isCardEditing, setisCardEditing] = useState(false)

  const [cardEditState, setcardEditState] = useState('')

  const [dragState, setdragState] = useState(Number)

  const [listInput, setlistInput] = useState('')

  const [isListEditing, setisListEditing] = useState(false)

  const handleDragStart = (e, index) => {
    e.stopPropagation()
    console.log(index)
    setdragState(index)
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
    const listObj = { ...props.list }
    const cardsArr = [...listObj.cards]
    let temp = cardsArr[dragState]
    cardsArr[dragState] = cardsArr[index]
    cardsArr[index] = temp
    listObj.cards = cardsArr
    console.log(listObj)

    const testObj = [...props.lists]

    testObj[props.listIndex].cards = cardsArr
    props.setlists(testObj)
    const response = await fetch('http://localhost:4000/lists/' + listObj.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(listObj)
    })
    console.log(response)
  }

  const delCard = async card => {
    const listObj = { ...props.list }
    const cardsArr = listObj.cards.filter(cardEntry => cardEntry.id !== card.id)
    listObj.cards = cardsArr
    const response = await fetch('http://localhost:4000/lists/' + listObj.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(listObj)
    })
    console.log(response)
    const testObj = [...props.lists]

    testObj[props.listIndex].cards = cardsArr
    console.log(testObj)
    props.setlists(testObj)
  }

  const listDel = async () => {
    const listsCopy = [...props.lists]
    const listsArr = listsCopy.filter(
      listEntry => props.list.id !== listEntry.id
    )
    console.log(props)
    const response = await fetch(
      'http://localhost:4000/lists/' + props.list.id,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(listsArr)
      }
    )
    console.log(response)
    props.setlists(listsArr)
  }

  const toggleEdit = card => {
    card.isEditing = true
    setisCardEditing(true)
  }

  const formSubmitHandler = async (event, card, index) => {
    event.preventDefault()
    const listClone = { ...props.list }
    const cardsClone = [...listClone.cards]
    cardsClone[index].cardName = cardEditState
    cardsClone[index].isEditing = false
    listClone.cards = cardsClone
    const response = await fetch(
      'http://localhost:4000/lists/' + props.list.id,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(listClone)
      }
    )
    console.log(response)
    setisCardEditing(false)
  }

  const inputHandler = event => {
    setcardEditState(event.target.value)
  }

  const toggleFormHandler = card => {
    card.isEditing = false
    setisCardEditing(false)
  }

  const toggleListEdit = () => {
    props.list.isEditing = true
    setisListEditing(true)
  }

  const inputListHandler = event => {
    setlistInput(event.target.value)
  }
  const formListSubmitHandler = async event => {
    event.preventDefault()
    const listClone = { ...props.list }
    listClone.listName = listInput
    listClone.isEditing = false
    const response = await fetch(
      'http://localhost:4000/lists/' + props.list.id,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(listClone)
      }
    )
    console.log(response)
    setisListEditing(false)
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
        <form
          action=''
          // className={classes.newAddress}
          onSubmit={event => formListSubmitHandler(event)}
        >
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
            onDragOver={e => handleDragOver(e, index)}
            onDragEnter={e => handleDragEnter(e, index)}
            onDragLeave={e => handleDragLeave(e, index)}
            onDrop={e => handleDrop(e, index)}
            onDragStart={e => handleDragStart(e, index)}
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
            onSubmit={event => formSubmitHandler(event, card, index)}
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
        ></AddCard>
      )}
    </div>
  )
}
