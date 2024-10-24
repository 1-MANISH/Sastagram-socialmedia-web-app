import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function OnlyIfUserNotLoggedIn() {

  const isLoggedIn = useSelector(store=>store.appConfigReducer.isLoggedIn)

  return (
        <>
            {isLoggedIn ? <Navigate to={"/feed"} /> : <Outlet />}
        </>
  )
}

export default OnlyIfUserNotLoggedIn
