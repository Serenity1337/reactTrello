import React, { useState, useEffect } from 'react'
import { Nav } from '../../components/Nav/Nav'
import classes from './Dashboards.module.scss'
import { BrowserRouter, Switch, Route, Redirect, Link } from 'react-router-dom'
import { Cards } from '../Cards/Cards'
export const Dashboards = () => {
  const currentUserName = JSON.parse(localStorage.getItem('user'))

  const [toggleForm, settoggleForm] = useState(false)

  const [formState, setformState] = useState({})

  const [dashboards, setdashboards] = useState([])

  const checkIfLoggedIn = () => {
    if (!currentUserName) {
      window.location.href = 'http://localhost:3000/login'
    }
  }
  checkIfLoggedIn()

  useEffect(() => {
    let unmounted = false

    const cancelForm = (event) => {
      if (event.keyCode === 27) {
        settoggleForm(false)
      }
    }
    const getDashboards = async () => {
      const response = await fetch('http://localhost:4000/dashboards')
      const dashboards = await response.json()

      const filteredDash = dashboards.filter(
        (board) => board.owner === currentUserName
      )
      if (!unmounted) {
        setdashboards(filteredDash)
      }
    }
    getDashboards()
    window.addEventListener('keydown', cancelForm)
    return () => {
      unmounted = true
    }
    return () => {
      window.removeEventListener('keydown', cancelForm)
    }
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
      owner: currentUserName,
      members: [],
    })
  }

  const dashboardHandler = async (event) => {
    event.preventDefault()
    event.target.elements[0].value = ''
    const response = await fetch('http://localhost:4000/dashboards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formState),
    })
    console.log(response)
    console.log(formState)
    setdashboards([...dashboards, formState])
  }
  return (
    <div>
      <Nav></Nav>
      <div className={classes.boardsContainer}>
        {dashboards.map((dashboard, dashboardIndex) => (
          <Link to={`${currentUserName}/${dashboard.dashboardName}`}>
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
              <div className={classes.createBtn}>Create Board</div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  )
}
