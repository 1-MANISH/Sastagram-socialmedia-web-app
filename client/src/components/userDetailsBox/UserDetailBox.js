import React, { useEffect, useState } from 'react'
import "./UserDetailBox.scss"
import userImage from "../../assets/images/user.png"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { sendFollowRequest, unFollowUser } from '../../redux/slices/appConfigSlice'

function UserDetailBox({user}) {

        const [loggedInUser,setLoggedInUser] = useState(true)
        const [userToShow,setUserToShow] = useState({})
        const navigate =  useNavigate()
        const dispatch = useDispatch()
        const currentUser = useSelector(store=>store.appConfigReducer.myProfile)
        const followingFlag = currentUser?.followings?.findIndex(following=>following._id === user?._id) !== -1
        const disabledButton = currentUser?.followingRequest?.findIndex(followingRequest=>followingRequest._id === user?._id) !== -1
        
        useEffect(()=>{
                if( user && currentUser?._id !== user?._id ){
                        setUserToShow(user)
                        setLoggedInUser(false)
                }else{
                        setUserToShow(currentUser)
                        setLoggedInUser(true)
                }
        },[user,currentUser])

          const followUnfollowRequestHandler = async (user) => {
                try {
                        if(!followingFlag)
                                dispatch(sendFollowRequest(user))
                        else
                                dispatch(unFollowUser(user))
                } catch (error) {
                        console.log("Send Follow Request Error");
                }
          }

        return (
        <div className='userDetailBox'>
                <div className='userImage'>
                <img  src={userToShow?.avatar?.url ? userToShow?.avatar?.url : userImage} alt='User Avatar'/>
                </div>
                <div className='userBio'>
                <h4>{userToShow?.bio}</h4>
                </div>
                <div className='userBasedBtn'>
                {
                        loggedInUser && <button className='secondary-btn' onClick={()=>{
                        navigate(`/user/update/${currentUser?._id}`)
                        }}>EDIT</button>
                }
                {
                        !loggedInUser && 
                        <button 
                                className='secondary-btn'
                                onClick={()=>{
                                        followUnfollowRequestHandler(user)
                                }}
                                disabled={disabledButton}
                        >
                        {
                                disabledButton ? "Request sent" :followingFlag ? "UnFollow" : "Follow"
                        }
                        </button>
                }
                </div>
        </div>
        )
}

export default UserDetailBox
