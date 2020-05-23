import React, { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Register } from './Pages/Register/Register'
import { Errors } from './Pages/Errors/Errors'
import { Login } from './Pages/Login/Login'
import { Dashboards } from './Pages/Dashboards/Dashboards'
import { Cards } from './Pages/Cards/Cards'
function App() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [dashs, setdashs] = useState([])
  useEffect(() => {
    let unmounted = false
    const getDashboards = async () => {
      const response = await fetch('http://localhost:4000/dashboards')
      const dashboards = await response.json()

      // const filteredDash = dashboards.filter((board) => board.owner === user)
      if (!unmounted) {
        setdashs(dashboards)
      }

      // console.log(filteredDash)
    }

    getDashboards()
    // return () => (mounted = false)
  }, [])

  return (
    <BrowserRouter>
      <Switch>
        {/* {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            component={() => <route.component />}
            exact={route.isExact}
          ></Route>
        ))} */}
        <Route
          path={`/login`}
          component={Login}
          exact={true}
          label='Login'
        ></Route>
        <Route
          path={`/register`}
          component={Register}
          exact={true}
          label='Register'
        ></Route>
        <Route path={`errors`} component={Errors} exact={true} label=''></Route>
        <Route
          path={`/${user}`}
          // component={Dashboards}
          render={() => <Dashboards></Dashboards>}
          exact={true}
          label='Dashboards'
        ></Route>
        {dashs.map((dash, dashIndex) => (
          <Route
            key={dashIndex}
            path={`/${user}/${dash.dashboardName}`}
            render={() => (
              <Cards dash={dash} dashs={dashs} dashIndex={dashIndex}></Cards>
            )}
            exact={true}
            label='Cards'
          ></Route>
        ))}
        {/* {<IndexRedirect to={`${user}`} />} */}

        {/* <Redirect from='*' to='/register' /> */}
      </Switch>
    </BrowserRouter>
  )
}

export default App
