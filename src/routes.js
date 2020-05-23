import { Register } from './Pages/Register/Register'
import { Cards } from './Pages/Cards/Cards'
import { Errors } from './Pages/Errors/Errors'
import { Login } from './Pages/Login/Login'
import { Dashboards } from './Pages/Dashboards/Dashboards'
const user = JSON.parse(localStorage.getItem('user'))
export const routes = [
  { isExact: true, component: Login, path: '/login', label: 'Login' },
  { isExact: true, component: Register, path: '/register', label: 'Register' },
  { isExact: true, component: Errors, path: '/Errors', label: '' },
  {
    isExact: true,
    component: Dashboards,
    path: `/${user}`,
    label: 'Dashboards',
  },
]
