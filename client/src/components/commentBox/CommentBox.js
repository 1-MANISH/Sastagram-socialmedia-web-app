import React, { useEffect, useState } from 'react'
import "./CommentBox.scss"
import Box  from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal';
import { IoIosSend } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { commentOnPost, getPostComment } from '../../redux/slices/postSlice';
import Comment from './Comment';
import { commentOnPostForFeedPost } from '../../redux/slices/feedSlice';



function CommentBox({open,handleClose,post,showFeed}) {

    const [message,setMessage] = useState("")
    const dispatch = useDispatch()
    

    const handleSubmit = async(e)=>{
            e.preventDefault()
            try {
                if(showFeed)
                    dispatch(commentOnPostForFeedPost({postId:post?._id,message:message,dispatch}))
                else
                    dispatch(commentOnPost({postId:post?._id,message:message,dispatch}))
                    
                dispatch(getPostComment(post._id))
            } catch (error) {
                console.log(`error from message sent ${error}`);
            }
    }



    const postComments = useSelector(store=>store.postReducer.postComments)
    
    useEffect(()=>{
            dispatch(getPostComment(post?._id))
    },[post._id,dispatch])
  
  return (
    <div className='commentBox'>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box  className="box">
                <Typography id="modal-modal-title" variant="h6" component="h2">

                    <div className='commentForm'>
                        <form onSubmit={handleSubmit}>
                            <input type='text' maxLength={40} placeholder='Type your message' value={message} onChange={(e)=>{setMessage(e.target.value)}} />
                            <IoIosSend className='sendIcon' onClick={handleSubmit}/>
                        </form>
                    </div>
                </Typography>
                <Typography className='comments' id="modal-modal-description" sx={{ mt: 2 }}>
                   
                   {
                    postComments?.map((comment)=>{
                        return <Comment comment={comment} />
                    })
                   }
                
                </Typography>
            </Box>
        </Modal>
    </div>
  )
}

export default CommentBox
