import React from 'react'
import "./FollowCard.scss"
import UserAvatar from '../avatar/UserAvatar'
import { useDispatch } from 'react-redux'
import { sendFollowRequest } from '../../redux/slices/appConfigSlice'

function FollowCard({user}) {

  const dispatch = useDispatch()

  const sendFollowRequestHandler = async (user) => {
      try {
          dispatch(sendFollowRequest(user))
      } catch (error) {
          console.log("Send Follow Request Error");
      }
  }
  
  
  return (
    <div className='followCard'>
        <div className='details'>
            <UserAvatar user={user} />
            <h3>{user?.name ? user?.name : "Rihan"}</h3>
        </div>
        <button  className='secondary-btn followBtn' onClick={()=>{
          sendFollowRequestHandler(user)
        }}>Follow</button>
    </div>
  )
}

export default FollowCard
