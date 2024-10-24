import React from 'react'
import NavBar from '../../components/navbar/NavBar'
import { Outlet } from 'react-router-dom'
import "./Home.scss"

function Home() {
  return (
    <>
      <NavBar />
      <div className='outlet'>
          <Outlet />
      </div>
      
    </>
  )
}

export default Home
