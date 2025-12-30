import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import ShowSuggestion from '../showSuggestion/ShowSuggestion'
import { useDispatch } from 'react-redux'
import { getMyFollowSuggestion,  } from '../../redux/slices/appConfigSlice'
import "./Feed.scss"
import { IoCreate } from "react-icons/io5";
import { getFeedData, subscribeToLikeDislikePost, subscribeToPostComment, subscribeToPostCreated, unsubscribeToLikeDislikePost, unsubscribeToPostComment, unsubscribeToPostCreated } from '../../redux/slices/feedSlice'

function Feed() {
        const navigate = useNavigate()
        const dispatch = useDispatch()

        

        useEffect(() => {
                dispatch(getMyFollowSuggestion())
                dispatch(getFeedData())
        }, [dispatch])

        useEffect(()=>{
                dispatch(subscribeToLikeDislikePost())
                dispatch(subscribeToPostComment())
                dispatch(subscribeToPostCreated())

                return ()=>{
                         dispatch(unsubscribeToLikeDislikePost())
                         dispatch(unsubscribeToPostComment())
                         dispatch(unsubscribeToPostCreated())
                }
        },[subscribeToLikeDislikePost,unsubscribeToLikeDislikePost,subscribeToPostComment,unsubscribeToPostComment,subscribeToPostCreated,unsubscribeToPostCreated])


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

