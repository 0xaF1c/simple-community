import { Link, createHashRouter } from 'react-router-dom'
import { Home } from '../pages/Home/Home'
import { MeProfile } from '../pages/Me/MeProfile'

export const router = createHashRouter([
  {
    path: '/',
    element: (
      <>
        <Home></Home>
      </>
    ),
    // Component: Home,
  },
  {
    path: '/activity',
    element: (
      <>
        <h1>Hello0</h1>
        <Link to="/">asdasdas</Link>
      </>
    ),
  },
  {
    path: '/me',
    element: <MeProfile />,
  },
])

export default router
