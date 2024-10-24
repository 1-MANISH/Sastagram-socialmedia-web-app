import React from 'react'
import { axiosClient } from '../../utils/axiosClient'
import { ACCESS_TOKEN_KEY, removeItem } from '../../utils/localStorageManager'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setIsLoggedIn, setMyFollowSuggestionEmpty, setMyProfileEmpty } from '../../redux/slices/appConfigSlice'
import { IoLogOut } from 'react-icons/io5'
import { CiEdit } from 'react-icons/ci'
import { IoIosNotifications } from "react-icons/io";
import { TiSocialInstagramCircular } from "react-icons/ti";
import Avatar from '../avatar/Avatar'
import "./NavBar.scss"
import { setUserProfileEmpty } from '../../redux/slices/postSlice'
import { setFeedDataEmpty } from '../../redux/slices/feedSlice'
import Badge from '@mui/material/Badge';

function NavBar() {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const currentUser = useSelector(store => store.appConfigReducer.myProfile)

  const logoutHandler = async () => {
    try {

      const response = await axiosClient.post("/auth/logout");
      console.log(response.result);
      removeItem(ACCESS_TOKEN_KEY)
      dispatch(setIsLoggedIn(false))
      dispatch(setMyProfileEmpty())
      dispatch(setMyFollowSuggestionEmpty())
      dispatch(setUserProfileEmpty())
      dispatch(setFeedDataEmpty())
      navigate("/login")

    } catch (error) {

      console.log(`logout ${error.message}`);

    }
  }

  const userProfileNavigationHandler = async (userId) => {
    navigate(`/user/profile/${userId}`)
  }

  return (
    <div className='navbar'>
      <div className='container'>
        <div className='leftNavbar'>
          <Avatar src={currentUser?.avatar?.url} />
        </div>
        <div className='midNavbar'>
          <TiSocialInstagramCircular onClick={() => {
            navigate("/feed")
          }} className='navLogo hover-link' />
        </div>
        <div className='rightNavbar'>
          <span className='userName hover-link' onClick={() => {
            userProfileNavigationHandler(currentUser?._id)
          }}> {currentUser?.name} </span>
          <span><CiEdit className='hover-link navLinks' onClick={() => {
            navigate(`/user/update/${currentUser?._id}`)
          }} /></span>
          <span>

            <Badge

              badgeContent={currentUser.followRequest?.length || 0}
              color="secondary"
              variant="dot"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
            >
              <IoIosNotifications className='hover-link  navLinks' onClick={() => {
                navigate(`/user/notification`)
              }} />
            </Badge>

          </span>
          <span><IoLogOut className='hover-link  navLinks' onClick={logoutHandler} /></span>
        </div>
      </div>
    </div>
  )
}

export default NavBar
