import React from 'react'
import { Outlet ,Navigate} from 'react-router-dom'
import { EmptyDemo } from '@/pages/NotLogIn'
const ProtectedRoute = () => {
  const user = null  // not logged in

  if (!user) {
    return <>
    <EmptyDemo/>
    </>
  }
  return (
    <>
    <Outlet/>
    </>
  )
}

export default ProtectedRoute


