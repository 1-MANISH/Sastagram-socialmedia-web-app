import React, { useState } from "react";
import "./EditPostBox.scss";
import { Box, Modal, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { updatePost } from "../../redux/slices/postSlice";

function EditPostBox({ open, handleClose, post }) {

    const [newTitle,setNewTitle]  =useState(post.title)
    const [newCaption,setNewCaption] = useState(post.caption)
    const [newPost,setNewPost] = useState(post.media.url)

    const dispatch = useDispatch()

    const handleSubmit = (e) =>{
        e.preventDefault()
        try {
            const updatedPost = {...post,title:newTitle,caption:newCaption}
            dispatch(updatePost({
                post:updatedPost,
                dispatch
            }))
        } catch (error) {
            console.log(`Error from ${error}`);
        }
    }
  return (
    <div className="editPostBox">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="editPostSubBox">
         
          <div className="leftPost"
          >

            {
                post.mediaType === "image" && 
                <label htmlFor="inputPost" className='labelImagePost'>
                    <img src={newPost} alt="userImagePost" className='userImagePost'/>
                </label>
            }
            {
                post.mediaType === "video" &&
                <label htmlFor="inputPost" className='labelVideoPost'>
                    <video alt="userVideoPost" controls autoPlay className='userVideoPost' >
                      <source src={ newPost } type="video/mp4" />
                    </video>
                </label>
            }

            
          </div>

          <div className="postRight" id="modal-modal-title" variant="h6" component="h2">
            <div className="editPostSubBoxForm">
              <form onSubmit={handleSubmit}>
                <input type="text" value={newTitle} required placeholder='Your Post Updated Title' maxLength={20} onChange={(e) => setNewTitle(e.target.value)} />
                <textarea rows={5} type="text" value={newCaption} required placeholder='Your Post Updated Caption' maxLength={100} onChange={(e) => setNewCaption(e.target.value)} />
                <input type="submit" value="UPDATE POST" className='primary-btn' onClick={handleSubmit} />
              </form>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default EditPostBox;
