import React, { useState } from 'react'
import classes from './AddList.module.scss'
const { random } = require('faker')

export const AddList = props => {
  const toggleFormHandler = () => {
    props.settoggleListForm(false)
  }

  const [formState, setformState] = useState({})
  const [submitState, setsubmitState] = useState(false)

  const inputHandler = event => {
    setformState({
      id: random.uuid(),
      listName: event.target.value,
      isEditing: false,
      cards: []
    })
  }

  const formSubmitHandler = async event => {
    event.preventDefault()
    event.target.elements.listName.value = ''
    const response = await fetch('http://localhost:4000/lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formState)
    })
    console.log(response)
    props.setlists([...props.lists, formState])
  }

  return (
    <form action='' className={classes.newAddress} onSubmit={formSubmitHandler}>
      <input
        className={classes.listName}
        name='listName'
        type='text'
        placeholder='Enter list title....'
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
