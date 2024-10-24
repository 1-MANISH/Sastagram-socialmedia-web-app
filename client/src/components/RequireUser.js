import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

function RequireUser() {

  const isLoggedIn = useSelector(store=>store.appConfigReducer.isLoggedIn)

  return (
    <>
        {isLoggedIn ? <Outlet /> : <Navigate to={"/login"}/>}
    </>
  )
}

export default RequireUser
