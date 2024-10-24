import React, { useEffect, useState } from 'react'
import "./ShowImagePost.scss"
import postImage from "../../assets/images/post.jpeg"
import { FaRegCommentAlt } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import UserAvatar from '../avatar/UserAvatar';
import CommentBox from '../commentBox/CommentBox';
import { useDispatch, useSelector } from 'react-redux';
import { getPostComment, likeOrDisLikeUserPost } from '../../redux/slices/postSlice';
import { likeOnPostForFeedPost } from '../../redux/slices/feedSlice';
import { useParams } from 'react-router-dom';
import EditPostBox from '../editPostBox/EditPostBox';

function ShowImagePost({post,showFeed}) {

  const [open,setOpen] = useState(false)
  const [openEditPost,setOpenEditPost] = useState(false)
  const [loggedInUser,setLoggedInUser] = useState(false)
  const param = useParams()

  const currentUser = useSelector((store)=>store.appConfigReducer.myProfile)
  const dispatch = useDispatch()

  const handleOpenEditPost = () =>{
     setOpenEditPost(true)
  }

  const handleCloseEditPost = () =>{
    setOpenEditPost(false)
  }

  const handleOpen = () => {
    setOpen(true)
    dispatch(getPostComment(post._id))
  }
  const handleClose = () =>{
    setOpen(false)
  }

  const handlePostLike = () => {
     try {
        const currentUserId = currentUser?._id
        const postId = post?._id

        if(showFeed){
          dispatch(likeOnPostForFeedPost({
            postId,
            currentUserId,
            dispatch
          }))

        }else{
          dispatch(likeOrDisLikeUserPost({
            postId,
            currentUserId,
            dispatch
          }))
        }

     } catch (error) {
      console.log(`Error from ${error}`);
     }
  }

  useEffect(()=>{
    if(param.userId && param.userId === currentUser._id){
      setLoggedInUser(true)
      
    }else{
      setLoggedInUser(false)
    }
    dispatch(getPostComment(post._id))
  },[dispatch,post._id,showFeed])

  return (
    <div className='showImagePost'>
        <div className='showImagePostCreator'>
           <div className='userShowLeftPanel'>
                <UserAvatar user={post?.createdBy}/>
                <span>{post?.createdBy?.name}</span>
           </div>
            <div className='userShowRightPanel'>
              {
                
                loggedInUser && 
                <>
                <IoMdMore className='icon' onClick={handleOpenEditPost}/>
                <EditPostBox open={openEditPost} handleClose={handleCloseEditPost} post={post}/>
                </>
              }
              {
                !loggedInUser && <IoMdMore className='icon'/>
              }
                
            </div>
        </div>
        <div className='showImagePostImage'>
           <img src={post?.media?.url ? post?.media?.url: postImage} />
        </div>
        <div className='showImagePostDetails'>
              <h4>{post?.title }</h4>
              <p>{post?.caption}</p>
        </div>
        <div className='showImagePostIcon'>
            <div className='showImagePostIconLeftPanel'>
                <div className='likes'>
                  {
                    post.isLiked && <span onClick={handlePostLike}><FaHeart style={{color:"red"}} className='icon'/></span>
                  }
                  {
                     !post.isLiked &&<span onClick={handlePostLike}><FaRegHeart className='icon'/ ></span>
                  }
                    
                    <span className='likeCount'>{post?.likedBy?.length ? post?.likedBy?.length : "No Likes"}</span>
                </div>
                <div className='commentIcon'>
                    <FaRegCommentAlt className='icon' onClick={handleOpen} />
                    <span className='commentCount'>{post?.comment?.length ? post?.comment?.length : "No Comments"}</span>
                    <CommentBox open={open} handleClose={handleClose} post={post} showFeed={showFeed} />
                </div>
            </div>
            <div className='showImagePostIconRightPanel'>
                <span>{post?.createdAgo}</span>
            </div>
           
        </div>
    </div>
  )
}

export default ShowImagePost



