import React from 'react'
import "./FollowFollowingCard.scss"
import UserAvatar from '../avatar/UserAvatar'
import { SlUserUnfollow } from "react-icons/sl";
import {  unFollowUser } from '../../redux/slices/appConfigSlice'
import { useDispatch } from 'react-redux';
function FollowFollowingCard({user}) {

const dispatch = useDispatch()
  return (
    <div className='followFollowingCard'>
                <div className='details'>
                <UserAvatar user={user} />
                <h3>{user?.name }</h3>
                </div>
                <div 
                className='cgIcon'
                onClick={()=>dispatch(unFollowUser(user))}
                >
                        <SlUserUnfollow  className='icon recIcon'/>
                </div>
    </div>
  )
}

export default FollowFollowingCard