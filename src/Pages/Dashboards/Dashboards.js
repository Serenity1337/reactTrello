import React, { useState, useEffect, useContext } from 'react'
import classes from './Dashboards.module.scss'
import { BrowserRouter, Switch, Route, Redirect, Link } from 'react-router-dom'
import { Cards } from '../Cards/Cards'
import { DashboardsContext } from '../../DashboardsContext'
import { UserContext } from '../../UserContext'

export const Dashs = () => {
  const [toggleForm, settoggleForm] = useState(false)

  const [formState, setformState] = useState({})

  const { dashboards, setdashboards } = useContext(DashboardsContext)

  const { user, setuser } = useContext(UserContext)

  const checkIfLoggedIn = () => {
    if (!localStorage.trellotoken) {
      window.location.href = 'http://localhost:3000/login'
    }
  }
  checkIfLoggedIn()
  useEffect(() => {
    fetch(
      `https://copytrelloapi.herokuapp.com/trello/trellodash/getalldashboards`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )
      .then((header) => {
        if (!header.ok) {
          throw Error(header)
        }
        return header.json()
      })
      .then((response) => {
        const filteredDash = response.filter(
          (board) => board.owner === user.userName
        )
        setdashboards(filteredDash)
      })
      .catch((e) => {})
  }, [])
  const formHandler = () => {
    settoggleForm(true)
  }

  const cancelBtnHandler = () => {
    settoggleForm(false)
  }

  const inputHandler = (event) => {
    setformState({
      dashboardName: event.target.value,
      isEditing: false,
      lists: [],
      owner: user.userName,
      members: [],
    })
  }

  const dashboardHandler = async (event) => {
    event.preventDefault()
    event.target.elements[0].value = ''
    const response = await fetch(
      'https://copytrelloapi.herokuapp.com/trello/trellodash/createdash',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      }
    )
    setdashboards([...dashboards, formState])
  }
  return (
    <div>
      <div className={classes.boardsContainer}>
        {dashboards.map((dashboard, dashboardIndex) => (
          <Link to={`/dashboard/${dashboard.dashboardName}`}>
            <div className={classes.dashboard} key={dashboardIndex}>
              <h1 className={classes.dashTitle}>{dashboard.dashboardName}</h1>
            </div>
          </Link>
        ))}
        <div className={classes.createBoard} onClick={formHandler}>
          Create new board
        </div>

        {toggleForm ? (
          <div className={classes.overlay}>
            <form
              action='#'
              className={classes.form}
              onSubmit={dashboardHandler}
            >
              <div className={classes.inputWrapper}>
                <input
                  type='text'
                  placeholder='Add board title'
                  className={classes.boardInput}
                  onInput={inputHandler}
                />
                <div
                  className={classes.cancelButton}
                  onClick={cancelBtnHandler}
                >
                  x
                </div>
              </div>
              <button type='submit' className={classes.createBtn}>
                Create Board
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  )
}
