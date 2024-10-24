import React from 'react'
import "./FollowRequestCard.scss"
import UserAvatar from '../avatar/UserAvatar'
import { CgCheck } from "react-icons/cg";
import { CgClose } from "react-icons/cg";
import { useDispatch } from 'react-redux';
import { acceptFollowRequest, rejectFollowRequest } from '../../redux/slices/appConfigSlice';

function FollowRequestCard({user}) {
   
  const dispatch = useDispatch()


  const acceptRequestHandler = async (user) => {
         try {
            dispatch(acceptFollowRequest(user))
         } catch (error) {
            console.log(`Error from accept Request : ${error}`);
         }
  }
  const rejectRequestHandler = async (user) => {
        try {
            dispatch(rejectFollowRequest(user))  
        } catch (error) {
          console.log(`Error from reject Request : ${error}`);
        }
  }

  return (
    <div className='followRequestCard'>
        <div className='details'>
            <UserAvatar user={user} />
            <h3>{user?.name || "Rihan"}</h3>
        </div>
        <div className='cgIcon'>
          <CgCheck className='checkIcon icon' onClick={()=>{
            acceptRequestHandler(user)
          }} />
          <CgClose className='closeIcon icon' onClick={()=>{
            rejectRequestHandler(user)
          }} />
        </div>
    </div>
  )
}

export default FollowRequestCard
