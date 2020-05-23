import React, { useState, useEffect } from 'react'
import logo from '../../utils/images/logo.svg'
import classes from './Register.module.scss'

export const Register = () => {
  const [emailState, setemailState] = useState('')
  const [nameState, setnameState] = useState('')
  const [passwordState, setpasswordState] = useState('')
  const [rpasswordState, setrpasswordState] = useState('')
  const [users, setusers] = useState([])
  const [nameErrorState, setnameErrorstate] = useState(false)
  const [emailErrorstate, setemailErrorstate] = useState(false)

  useEffect(() => {
    fetch('http://localhost:4000/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((header) => {
        if (!header.ok) {
          throw Error(header)
        }
        return header.json()
      })
      .then((response) => {
        console.log(response)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  const emailInputHandler = (event) => {
    setemailState(event.target.value)
  }
  const nameInputHandler = (event) => {
    setnameState(event.target.value)
  }
  const passwordInputHandler = (event) => {
    setpasswordState(event.target.value)
  }
  const rpasswordInputHandler = (event) => {
    setrpasswordState(event.target.value)
  }
  const userSubmitHandler = async (event) => {
    event.preventDefault()
    Array.prototype.forEach.call(event.target.elements, (element) => {
      element.value = ''
    })
    if (passwordState === rpasswordState) {
      const userData = {
        userNames: [],
        userEmails: [],
      }
      users.map((user) => {
        userData.userNames.push(user.name)
        userData.userEmails.push(user.email)
      })
      console.log(userData)
      const dupeName = userData.userNames.includes(nameState)
      const dupeEmail = userData.userEmails.includes(emailState)

      if (dupeName) {
        setnameErrorstate(true)
        if (dupeEmail) {
          setemailErrorstate(true)
        }
      } else {
        setnameErrorstate(false)
        if (dupeEmail) {
          setemailErrorstate(true)
        } else {
          setemailErrorstate(false)
          // const response = await fetch(
          //   'http://localhost:3000/trello/user/register',
          //   {
          //     method: 'POST',
          //     headers: {
          //       'Content-Type': 'application/json',
          //     },
          //     body: JSON.stringify({
          //       email: emailState,
          //       name: nameState,
          //       password: passwordState,
          //     }),
          //   }
          // )

          let body = {
            password: passwordState,
            username: nameState,
            email: emailState,
          }
          fetch('http://localhost:4000/users', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((header) => {
              console.log(header)
              if (header.ok) {
                return header.json()
              } else {
                alert('Registration failed')
              }
            })
            .then((response) => {
              if (response) {
                // alert('Registration successful')

                window.location.href = 'http://localhost:3000/login'
              }
            })
            .catch((e) => {
              console.log(e)
            })
        }
        // console.log(response)
      }
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
              onInput={emailInputHandler}
            />
            {emailErrorstate ? (
              <span className={classes.error}>
                This email address is already taken
              </span>
            ) : (
              <span></span>
            )}
            <input
              type='text'
              placeholder='Enter full name'
              onInput={nameInputHandler}
            />
            {nameErrorState ? (
              <span className={classes.error}>
                This Username is already taken
              </span>
            ) : (
              <span></span>
            )}
            <input
              type='password'
              placeholder='Create password'
              onInput={passwordInputHandler}
            />
            <input
              type='password'
              placeholder='Repeat password'
              onInput={rpasswordInputHandler}
            />
            <button type='submit' className={classes.signBtn}>
              Sign up
            </button>
            <a href='http://localhost:3000/login'>
              Already have an account? Click to log-in
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}
