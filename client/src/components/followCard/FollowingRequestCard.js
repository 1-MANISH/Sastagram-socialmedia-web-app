import React from 'react'
import "./FollowingRequestCard.scss"
import UserAvatar from '../avatar/UserAvatar'
import { MdOutlineCallReceived } from "react-icons/md";

function FollowingRequestCard({user}) {
  return (
    <div className='followingRequestCard'>
        <div className='details'>
            <UserAvatar user={user} />
            <h3>{user?.name }</h3>
        </div>
        <div className='cgIcon'>
          <MdOutlineCallReceived  className='icon recIcon'/>
        </div>
    </div>
  )
}

export default FollowingRequestCard
