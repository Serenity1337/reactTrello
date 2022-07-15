import React, { useState, useEffect, useContext } from 'react'
import logo from '../../utils/images/logo.svg'
import classes from './Register.module.scss'
import { UserContext } from '../../UserContext'

export const Register = () => {
  const [profile, setprofile] = useState({})
  const [error, seterror] = useState('')
  const { user, setuser } = useContext(UserContext)

  if (localStorage.trellotoken) {
    window.location.href = `/`
  }
  const inputHandlers = (event) => {
    setprofile({ ...profile, [event.target.name]: event.target.value })
  }
  const userSubmitHandler = (event) => {
    event.preventDefault()
    const copyProfile = { ...profile }
    delete copyProfile.rpassword
    if (
      profile.userName &&
      profile.email &&
      profile.password &&
      profile.rpassword
    ) {
      if (profile.password === profile.rpassword) {
        fetch(
          'https://copytrelloapi.herokuapp.com/trello/trellouser/register',
          {
            method: 'POST',
            body: JSON.stringify(copyProfile),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
          .then((header) => {
            return header.json()
          })
          .then((response) => {
            if (response.error) {
              seterror(response.msg)
            } else {
              window.location.href = `/login`
            }
          })
          .catch((e) => {})
      } else {
        seterror('Wrong repeated password')
      }
    } else {
      seterror('Please fill the empty fields.')
    }
  }
  return (
    <div>
      <div className={classes.imgWrapper}>
        <img src={logo} alt='dsa' className={classes.logo} />
      </div>
      <div className={classes.card}>
        <h1 className={classes.title}>Sign up for your account</h1>

        <form action='' onSubmit={userSubmitHandler}>
          <div className={classes.formWrapper}>
            <input
              type='email'
              placeholder='Enter email address'
              onInput={inputHandlers}
              name='email'
            />
            <input
              type='text'
              placeholder='Enter username'
              onInput={inputHandlers}
              name='userName'
            />
            <input
              type='password'
              placeholder='Create password'
              onInput={inputHandlers}
              name='password'
            />
            <input
              type='password'
              placeholder='Repeat password'
              onInput={inputHandlers}
              name='rpassword'
            />
            <button type='submit' className={classes.signBtn}>
              Sign up
            </button>
            <a href='/login'>Already have an account? Click to log-in</a>
            {error ? <div className={classes.error}>{error}</div> : null}
          </div>
        </form>
      </div>
    </div>
  )
}
