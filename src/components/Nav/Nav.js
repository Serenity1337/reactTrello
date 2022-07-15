import React, { useState, useContext } from 'react'
import { UserContext } from '../../UserContext'
import classes from './Nav.module.scss'
import logo from '../../utils/images/logo2.svg'
export const Nav = () => {
  const { user, setuser } = useContext(UserContext)
  const logOut = () => {
    localStorage.clear()
    window.location.href = 'http://localhost:3000/login'
  }
  return (
    <div className={classes.flex}>
      <h1 className={classes.userName}>Welcome back, {user.userName}</h1>
      <a href='/' className={classes.logo}>
        <img src={logo} alt='' className={classes.logo} />
      </a>

      <div className={classes.logOut} onClick={logOut}>
        Log Out
      </div>
    </div>
  )
}
