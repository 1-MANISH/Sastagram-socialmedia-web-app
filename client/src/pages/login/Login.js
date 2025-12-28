import  {  useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { axiosClient } from '../../utils/axiosClient'
import { useDispatch } from 'react-redux'
import  {setIsLoggedIn,getMyProfile } from '../../redux/slices/appConfigSlice'
import "./Login.scss"
import toast from 'react-hot-toast'



function Login() {

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
                                toast.success("Login Successfull")
                                dispatch(getMyProfile())
                                dispatch(setIsLoggedIn(true))
                                navigate("/feed")
                        }
                        else {
                                toast.error("Login Failed")
                                navigate("/signup")
                        }
                } catch (error) {
                         toast.error("Login Failed")
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
