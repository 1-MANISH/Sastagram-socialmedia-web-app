import React from 'react'
import userImage from "../../assets/images/user.png"
import "./Avatar.scss"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
function Avatar({src}) {

  const navigate = useNavigate()
  const currentUser = useSelector(store=>store.appConfigReducer.myProfile)

  const userProfileNavigationHandler = async (userId) => {
    navigate(`/user/profile/${userId}`)
  }

  return (
    <div className='avatar' onClick={()=>{
      userProfileNavigationHandler(currentUser?._id)
    }}>
       <img src={src ? src : userImage} alt='user-avatar' className='hover-link' />
    </div>
  )
}

export default Avatar
