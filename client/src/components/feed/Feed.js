import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import ShowSuggestion from '../showSuggestion/ShowSuggestion'
import { useDispatch } from 'react-redux'
import { getMyFollowSuggestion, getMyProfile } from '../../redux/slices/appConfigSlice'
import "./Feed.scss"
import { IoCreate } from "react-icons/io5";
import { getFeedData } from '../../redux/slices/feedSlice'

function Feed() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

 

  useEffect(() => {
    dispatch(getMyProfile())
    dispatch(getMyFollowSuggestion())
    dispatch(getFeedData())
  }, [dispatch])


  return (
    <div className='feed'>
      <div className='container'>
        <div className='showPostContainer'>
          <div className='postbuttons'>
            <button className='post-btn'  onClick={() => { navigate("/feed/images") }}>Images</button>
            <button className='post-btn'  onClick={() => { navigate("/feed/videos") }}>Video</button>
          </div>
          <div className='posts'>
            <Outlet />
          </div>
        </div>
        <div className='showSuggestionContainer'>
          <ShowSuggestion />
          <div className='createPostBtn ' onClick={()=>{
              navigate(`/user/post/create`)
          }}>
              <IoCreate className='createIcon'/>
              <span className='createHeading'>Create Post</span> 
          </div>
        </div>
      </div>
    </div>
  )
}

export default Feed

