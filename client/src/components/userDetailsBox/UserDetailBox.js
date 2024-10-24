import React, { useEffect, useState } from 'react'
import "./UserDetailBox.scss"
import userImage from "../../assets/images/user.png"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function UserDetailBox({user}) {

    const [loggedInUser,setLoggedInUser] = useState(true)
    const [userToShow,setUserToShow] = useState({})
    const navigate =  useNavigate()
    const currentUser = useSelector(store=>store.appConfigReducer.myProfile)
    
    useEffect(()=>{
           if( user && currentUser?._id !== user?._id ){
            setUserToShow(user)
            setLoggedInUser(false)
           }else{
            setUserToShow(currentUser)
            setLoggedInUser(true)
           }
    },[user])

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
                !loggedInUser && <button className='secondary-btn'>UNFOLLOW</button>
            }
         </div>
    </div>
  )
}

export default UserDetailBox
