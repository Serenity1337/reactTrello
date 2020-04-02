import React from 'react'
import classes from './AddCardButton.module.scss'
export const AddCardButton = props => {
  const formBtnHandler = () => {
    props.setcardFormState(true)
  }
  return (
    <div className={classes.addListCard} onClick={formBtnHandler}>
      + Add a card
    </div>
  )
}
