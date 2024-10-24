import React, { useEffect, useState } from 'react'
import "./UserProfile.scss"
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserProfile } from '../../redux/slices/postSlice'
import UserDetailBox from '../userDetailsBox/UserDetailBox'

function UserProfile() {

  const[isLoggedInUser,setIsLoggedInUser]=useState(true)
  const param = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  
  useEffect(()=>{
     setIsLoggedInUser(userProfile._id === currentUserProfile._id)
     dispatch(getUserProfile(param.userId))
  },[param.userId])

  const currentUserProfile = useSelector(store=>store.appConfigReducer.myProfile)
  const userProfile = useSelector(store=>store.postReducer.userProfile)


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
