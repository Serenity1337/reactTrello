import React, { useState } from 'react'
import classes from './AddListButton.module.scss'

export const AddListButton = listState => {
  const toggleFormHandler = () => {
    console.log(listState)
    listState.settoggleListForm(true)
  }

  return (
    <div>
      <button onClick={toggleFormHandler} className={classes.addAnotherList}>
        + Add another list
      </button>
    </div>
  )
}
