import React from 'react'
import classes from './Nav.module.scss'
export const Nav = () => {
  const logOut = () => {
    localStorage.clear()
    window.location.href = 'http://localhost:3000/login'
  }
  const userName = JSON.parse(localStorage.getItem('user'))
  return (
    <nav className={classes.flex}>
      <h1 className={classes.userName}>Welcome back, {userName}</h1>
      <div className={classes.logOut} onClick={logOut}>
        Log Out
      </div>
    </nav>
  )
}
