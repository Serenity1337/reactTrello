import React, { useState, useEffect } from 'react'
import classes from './AddList.module.scss'
import { Dashboards } from '../../Pages/Dashboards/Dashboards'
const { random } = require('faker')

export const AddList = (props) => {
  const toggleFormHandler = () => {
    props.settoggleListForm(false)
  }

  const [formState, setformState] = useState({})
  const [submitState, setsubmitState] = useState(false)

  const inputHandler = (event) => {
    setformState({
      id: random.uuid(),
      listName: event.target.value,
      isEditing: false,
      cards: [],
    })
  }

  const formSubmitHandler = async (event) => {
    event.preventDefault()
    event.target.elements.listName.value = ''
    const dashCopy = { ...props.dash.dash }
    dashCopy.lists.push(formState)
    console.log(dashCopy)
    const response = await fetch(
      `http://localhost:4000/dashboards/` + props.dash.dash.id,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dashCopy),
      }
    )
    console.log(response)

    props.setlists([...dashCopy.lists])
  }

  return (
    <form action='' className={classes.newList} onSubmit={formSubmitHandler}>
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
