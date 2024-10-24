import React from 'react'
import userImage from "../../assets/images/avatarDesign.png"
import "./UserAvatar.scss"
import { useNavigate } from 'react-router-dom'

function UserAvatar({user}) {

    const navigate = useNavigate()
    const src = user?.avatar?.url
    return (
    <div className='userAvatar'  onClick={()=>{
          navigate(`/user/profile/${user?._id}`)
      }}>
        <img src={src ? src : userImage} alt='user-avatar' className='hover-link' />
    </div>
  )
}

export default UserAvatar
