import React, { useState, useEffect, useContext } from 'react'
import logo from '../../utils/images/logo.svg'
import classes from './Login.module.scss'
import { Redirect } from 'react-router-dom'
import { UserContext } from '../../UserContext'

export const Login = () => {
  const [emailState, setemailState] = useState('')
  const { user, setuser } = useContext(UserContext)
  const [error, seterror] = useState('')
  const [passwordState, setpasswordState] = useState('')

  if (localStorage.trellotoken) {
    window.location.href = `/`
  }
  const emailInputHandler = (event) => {
    setemailState(event.target.value)
  }
  const passwordInputHandler = (event) => {
    setpasswordState(event.target.value)
  }
  //
  const userLoginHandler = (event) => {
    event.preventDefault()
    fetch('https://copytrelloapi.herokuapp.com/trello/trellouser/login', {
      method: 'POST',
      body: JSON.stringify({ email: emailState, password: passwordState }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((header) => {
        return header.json()
      })
      .then((response) => {
        if (response.error) {
          seterror('Email or password is incorrect')
        } else {
          localStorage.setItem('trellotoken', JSON.stringify(response))
          window.location.href = `/`
        }
      })
      .catch((e) => {})
  }
  return (
    <div>
      <div className={classes.imgWrapper}>
        <img src={logo} alt='dsa' className={classes.logo} />
      </div>
      <div className={classes.card}>
        <h1 className={classes.title}>Log in to Trello</h1>

        <form action='' onSubmit={userLoginHandler}>
          <div className={classes.formWrapper}>
            <input
              type='email'
              placeholder='Enter email address'
              onInput={emailInputHandler}
            />
            <input
              type='password'
              placeholder='Create password'
              onInput={passwordInputHandler}
            />

            <button type='submit' className={classes.signBtn}>
              Log in
            </button>
            <a href='/register'>Don't have an account? Sign up here</a>
            {error ? <div className={classes.error}> {error} </div> : null}
          </div>
        </form>
      </div>
      {/* {user ? <Redirect to='/' /> : null} */}
    </div>
  )
}
