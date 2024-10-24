import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import { ACCESS_TOKEN_KEY, setItem } from '../../utils/localStorageManager'
import { useDispatch } from 'react-redux'
import { setIsLoggedIn, setToastData } from '../../redux/slices/appConfigSlice'
import "./Login.scss"
import { TOAST_SUCCESS } from '../../App'

function Login() {``

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (email && password) {

        const response = await axiosClient.post("/auth/login", {
          email,
          password
        })

        setItem(ACCESS_TOKEN_KEY, response.result.accessToken)
        dispatch(setIsLoggedIn(true))
        dispatch(setToastData({
          type:TOAST_SUCCESS,
          message:"Login Successfully 🎯"
        }))
        navigate("/feed")
      }
      else {
        navigate("/signup")
      }
    } catch (error) {
      console.log(`login error ${error.message}`);
    }

  }
  return (
    <div className='loginPage'>
       <div className='loginBox'>
       <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className='email'
          id='email'
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          className='password'
          id='password'
          onChange={(e) => setPassword(e.target.value)}
        />

        <input type="submit" className="primary-btn submit-btn" />
      </form>
      <p className='signupNote'>Create An Account . <Link to={"/signup"}> Signup</Link></p>
       </div>
    </div>
  )
}

export default Login
