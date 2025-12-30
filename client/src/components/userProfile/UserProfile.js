import React, { useEffect, useState } from 'react'
import "./UserProfile.scss"
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../../redux/slices/postSlice'
import UserDetailBox from '../userDetailsBox/UserDetailBox'
import { subscribeToLikeDislikePost, subscribeToPostComment, subscribeToPostCreated, unsubscribeToLikeDislikePost, unsubscribeToPostComment, unsubscribeToPostCreated } from '../../redux/slices/feedSlice'

function UserProfile() {

        const[isLoggedInUser,setIsLoggedInUser]=useState(true)
        const param = useParams()
        const dispatch = useDispatch()
        const navigate = useNavigate()

        const currentUserProfile = useSelector(store=>store.appConfigReducer.myProfile)
        const userProfile = useSelector(store=>store.postReducer.userProfile)

        
        useEffect(()=>{
                dispatch(getUserProfile(param.userId))
                setIsLoggedInUser(userProfile._id === currentUserProfile?._id)
        },[param.userId,userProfile._id,currentUserProfile._id])

        useEffect(()=>{
                        dispatch(subscribeToLikeDislikePost())
                        dispatch(subscribeToPostComment())
                        dispatch(subscribeToPostCreated())
        
                        return ()=> {
                                dispatch(unsubscribeToLikeDislikePost())
                                dispatch(unsubscribeToPostComment())
                                dispatch(unsubscribeToPostCreated())
                        }
        },[subscribeToLikeDislikePost,unsubscribeToLikeDislikePost,subscribeToPostComment,unsubscribeToPostComment,subscribeToPostCreated,unsubscribeToPostCreated])




        return (
        <div className='userProfile'>
                <div className='container'>
                <div className='userProfileleftPanel'>
                        <div className='postbuttons'>
                                <button className='post-btn'  onClick={() => { navigate(`/user/profile/${isLoggedInUser?currentUserProfile._id:userProfile._id}/post/image`) }}>Images</button>
                                <button className='post-btn'  onClick={() => { navigate(`/user/profile/${isLoggedInUser?currentUserProfile._id:userProfile._id}/post/video`) }}>Video</button>
                        </div>
                        <div className='posts'>
                        <Outlet  />
                        </div>
                </div>
                <div className='userProfileRightPanel'>
                        <UserDetailBox user={isLoggedInUser?currentUserProfile :userProfile} />
                </div>
                </div>
        </div>
        )
}

export default UserProfile
