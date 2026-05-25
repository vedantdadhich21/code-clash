import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Navbar from '@/components/shared/Navbar'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import Home from '@/pages/Home'
import Lobby from '@/pages/Lobby'
import Battle from '@/pages/Battle'
import Results from '@/pages/Results'
import Leaderboard from '@/pages/Leaderboard.jsx'
import Profile from '@/pages/Profile'
import ErrorPage from './ErrorPage'

function Layout() {
  return (
    <div className="min-h-screen text-foreground">
      <Navbar />
      <Outlet />
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/leaderboard', element: <Leaderboard /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/lobby/:roomId', element: <Lobby /> },
          { path: '/battle', element: <Battle /> },
          { path: '/results/:roomId', element: <Results /> },
          { path: '/profile/:userId', element: <Profile /> },
        ]
      }
    ],
    errorElement: <ErrorPage/>
  }
])

export default function App() {
  return <RouterProvider router={router} />
}
