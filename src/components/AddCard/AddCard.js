import React, { useState } from 'react'
import classes from './AddCard.module.scss'
const { random } = require('faker')

export const AddCard = props => {
  const toggleFormHandler = () => {
    props.setcardFormState(false)
  }

  const [cardState, setcardState] = useState({})

  const inputHandler = event => {
    setcardState({
      id: random.uuid(),
      cardName: event.target.value,
      isEditing: false
    })
  }

  const formSubmitHandler = async event => {
    event.preventDefault()
    const listClone = { ...props.list }
    listClone.cards.push(cardState)
    console.log()
    event.target.elements.cardName.value = ''
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
    const listsClone = [...props.lists]
    listsClone[props.listIndex] = listClone
    props.setlists([...listsClone])
    console.log(response)
    setcardState({
      id: random.uuid(),
      cardName: '',
      isEditing: false
    })
  }
  return (
    <form
      action=''
      className={classes.newAddress}
      onSubmit={event => formSubmitHandler(event)}
    >
      <input
        className={classes.cardName}
        name='cardName'
        type='text'
        placeholder='Enter card title....'
        onInput={inputHandler}
      />
      <div className={classes.flexContainer}>
        <button type='submit' className={classes.submitBtn}>
          Add List
        </button>
        <div className={classes.cancelBtn} onClick={toggleFormHandler}>
          <i className='fas fa-times'></i>
        </div>
      </div>
    </form>
  )
}
