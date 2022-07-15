import React, { useState, useEffect, useMemo } from 'react'
import './App.css'
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useLocation,
  Link,
} from 'react-router-dom'
import { Register } from './Pages/Register/Register'
import { Errors } from './Pages/Errors/Errors'
import { Login } from './Pages/Login/Login'
import { Dashs } from './Pages/Dashboards/Dashboards'
import { Cards } from './Pages/Cards/Cards'
import { UserContext } from './UserContext'
import { DashboardsContext } from './DashboardsContext'
import { Nav } from './components/Nav/Nav'

function App() {
  const [user, setuser] = useState([])
  const [dashboards, setdashboards] = useState([])
  const userValue = useMemo(() => ({ user, setuser }), [user, setuser])
  const dashboardsValue = useMemo(
    () => ({ dashboards, setdashboards }),
    [dashboards, setdashboards]
  )
  let location = useLocation()
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
        // const filteredDashes = response.filter(
        //   (dash) => dash.owner === user.userName
        // )
        setdashboards(response)
      })
      .catch((e) => {
        //dosomethinghere
      })

    if (localStorage.trellotoken) {
      let token = JSON.parse(localStorage.getItem('trellotoken'))
      fetch(
        `https://copytrelloapi.herokuapp.com/trello/trellouser/getSingleUser/${token.id}`,
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
          setuser(response)
        })
        .catch((e) => {
          //dosomethinghere
        })
    } else {
      return
    }
  }, [])
  if (location.pathname !== '/login' && '/register') {
  }
  return (
    <Switch>
      <UserContext.Provider value={userValue}>
        <DashboardsContext.Provider value={dashboardsValue}>
          {/* {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            component={() => <route.component />}
            exact={route.isExact}
          ></Route>
        ))} */}

          {location.pathname !== '/login' &&
          location.pathname !== '/register' ? (
            <Nav />
          ) : null}

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
          <Route
            path={`errors`}
            component={Errors}
            exact={true}
            label=''
          ></Route>
          <Route
            path={`/`}
            render={() => <Dashs />}
            exact={true}
            label='Dashboards'
          ></Route>
          {dashboards.map((dash, dashIndex) => (
            <Route
              key={dashIndex}
              path={`/dashboard/${dash.dashboardName}`}
              render={() => <Cards dash={dash} dashIndex={dashIndex}></Cards>}
              exact={true}
              label='Cards'
            ></Route>
          ))}
        </DashboardsContext.Provider>
      </UserContext.Provider>
    </Switch>
  )
}

export default App
