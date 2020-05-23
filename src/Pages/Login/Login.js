import React, { useState, useEffect } from 'react'
import logo from '../../utils/images/logo.svg'
import classes from './Login.module.scss'

export const Login = () => {
  const [emailState, setemailState] = useState('')
  const [passwordErrorState, setpasswordErrorState] = useState(false)
  const [users, setusers] = useState([])
  const [emailErrorstate, setemailErrorstate] = useState(false)
  const [passwordState, setpasswordState] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('http://localhost:4000/users')
      const users = await response.json()
      setusers(users)
    }
    fetchUsers()
    console.log(users)
  }, [])

  const emailInputHandler = (event) => {
    setemailState(event.target.value)
  }
  const passwordInputHandler = (event) => {
    setpasswordState(event.target.value)
  }
  const userLoginHandler = async (event) => {
    event.preventDefault()
    users.map((user) => {
      if (user.email === emailState) {
        setemailErrorstate(false)
        if (user.password === passwordState) {
          setpasswordErrorState(false)

          localStorage.setItem('user', JSON.stringify(user.username))
          window.location.href = `http://localhost:3000/${user.username}`
          // JSON.parse(localStorage.getItem('komentarai'));
        } else {
          setpasswordErrorState(true)
        }
      } else {
        setemailErrorstate(true)
      }
    })
    console.log(users)

    //  const userExists = userData.emails.includes(emailState)
    //  const passwordIsCorrect = userData.password.includes(passwordState)
    //  if (userExists && passwordIsCorrect) {

    //  }
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
            {emailErrorstate ? (
              <span className={classes.error}>
                Incorrect email or this email does not exist.
              </span>
            ) : (
              <span></span>
            )}
            <input
              type='password'
              placeholder='Create password'
              onInput={passwordInputHandler}
            />
            {passwordErrorState ? (
              <span className={classes.error}>
                Incorrect password please check spelling
              </span>
            ) : (
              <span></span>
            )}
            <button type='submit' className={classes.signBtn}>
              Log in
            </button>
            <a href='http://localhost:3000/register'>
              Don't have an account? Sign up here
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
