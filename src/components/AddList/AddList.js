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
      listName: event.target.value,
      isEditing: false,
      cards: [],
      _id: '',
    })
  }

  const formSubmitHandler = async (event) => {
    event.preventDefault()
    event.target.elements.listName.value = ''
    if (formState.listName) {
      const formStateCopy = { ...formState }
      formStateCopy._id = random.uuid()
      const dashCopy = { ...props.dash.dash }
      const listsCopy = [...props.lists, formStateCopy]

      dashCopy.lists = listsCopy
      const response = await fetch(
        `https://copytrelloapi.herokuapp.com/trello/trellodash/editdash/${props.dash.dash._id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dashCopy),
        }
      )

      setformState({
        _id: random.uuid(),
        listName: '',
        isEditing: false,
        cards: [],
      })
      props.setlists([...listsCopy])
    }
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
