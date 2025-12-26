import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import "./Signup.scss"
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'

function Signup() {

        const [name, setName] = useState("")
        const [email, setEmail] = useState("")
        const [password, setPassword] = useState("")
        const navigate = useNavigate()


        const handleSubmit = async (e) => {
                e.preventDefault()
                try {
                        await axiosClient.post("/auth/signup", {
                                name,
                                email,
                                password
                        })
                        toast.success("Account Created Successfully")
                        
                        navigate("/login")
                } catch (error) {
                        toast.error("Account Creation Failed")
                        console.log(`signup error  ${error.message}`);
                }

        }

        return (
                <div className='signupPage'>
                        <div className='signupBox'>
                                <h1>Register</h1>
                                <form onSubmit={handleSubmit}>
                                         <label htmlFor="name">Name</label>
                                        <input
                                                type="text"
                                                className='name'
                                                id='name'
                                                onChange={(e) => setName(e.target.value)}
                                        />
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

                                         <input className="primary-btn submit-btn" type="submit"  />
                                </form>
                                <p className='signupNote'>Already Registered ? <Link to={"/login"}> Login</Link></p>
                        </div>
                </div>
        )
}

export default Signup
