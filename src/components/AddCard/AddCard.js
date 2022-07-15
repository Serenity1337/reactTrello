import React, { useState } from 'react'
import classes from './AddCard.module.scss'
const { random } = require('faker')

export const AddCard = (props) => {
  const toggleFormHandler = () => {
    props.setcardFormState(false)
  }

  const [cardState, setcardState] = useState({})

  const inputHandler = (event) => {
    setcardState({
      id: random.uuid(),
      cardName: event.target.value,
      isEditing: false,
    })
  }

  const formSubmitHandler = async (event) => {
    event.preventDefault()
    if (cardState.cardName) {
      const dashClone = { ...props.dash }
      const listClone = { ...props.list }
      listClone.cards.push(cardState)
      event.target.elements.cardName.value = ''
      dashClone.lists[props.listIndex] = listClone
      const response = await fetch(
        `https://copytrelloapi.herokuapp.com/trello/trellodash/editdash/${props.dash._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dashClone),
        }
      )
      const listsClone = [...props.lists]
      listsClone[props.listIndex] = listClone
      props.setlists([...listsClone])
    }
  }
  return (
    <form
      action=''
      className={classes.newAddress}
      onSubmit={(event) => formSubmitHandler(event)}
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
          Add Card
        </button>
        <div className={classes.cancelBtn} onClick={toggleFormHandler}>
          <i className='fas fa-times'></i>
        </div>
      </div>
    </form>
  )
}
