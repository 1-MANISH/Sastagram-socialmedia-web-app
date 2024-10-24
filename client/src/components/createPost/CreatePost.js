import React, { useEffect, useState } from 'react'
import "./CreatePost.scss"
import UserDetailBox from '../userDetailsBox/UserDetailBox'
import { useDispatch, useSelector } from 'react-redux'
import { createPost, getUserProfile } from '../../redux/slices/postSlice'
import demoPostImage from "./../../assets/media/demoPostImage.jpg"
import demoPostVideo from "./../../assets/media/demoPostVideo.3gp"

function CreatePost() {

  const [title, setTitle] = useState("")
  const [caption, setCaption] = useState("")
  const [userPost, setUserPost] = useState("")
  const [mediaType, setMediaType] = useState("image")
  const dispatch = useDispatch()
  const currentUser = useSelector(store=>store.appConfigReducer.myProfile)
  
  useEffect(()=>{
    dispatch(getUserProfile(currentUser?._id))
  },[dispatch])


  const handleOptionChange = async (e) => {
    setMediaType(e.target.value)

  }
  const handlePostChange = async (e) => {

    console.log("called");
    e.preventDefault()
    try {

      const file = e.target.files[0]
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        if (fileReader.readyState === fileReader.DONE) {
          setUserPost(fileReader.result)
          console.log(userPost);
        }
      }
    } catch (error) {
      console.log(`Error from upload post `);
    }


  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
        dispatch(createPost({
          body:{
            title,
            caption,
            mediaType,
            media:userPost
          },
         dispatch
        }))
   
       
    } catch (error) {
        console.log(`Error from ${error}`);
    }
  }

  useEffect(()=>{
    dispatch(getUserProfile(currentUser?._id))
  },[dispatch])

  return (
    <div className='createPost'>
      <div className='container'>
        <div className="createPostLeftPanel">
          <div className="createPostShowPost">
            <div className="post">
              {
                mediaType === "image" &&

                <label htmlFor="inputPost" className='labelImagePost'>
                  <img src={userPost ? userPost : demoPostImage} alt="userImagePost" className='userImagePost'/>
                </label>
              }
              {
                mediaType === "video" &&

                <label htmlFor="inputPost" className='labelVideoPost'>
                    <video alt="userVideoPost" controls autoPlay className='userVideoPost' >
                      <source src={ userPost ? userPost : demoPostVideo } type="video/mp4" />
                    </video>
                </label>

              }
              <input
                className='inputPost'
                id='inputPost'
                type="file"
                onChange={handlePostChange}
              />

            </div>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="createPostTextBox">
              <input type="text" value={title} required placeholder='Your Post Title' maxLength={20} onChange={(e) => setTitle(e.target.value)} />
              <textarea type="text" value={caption} required placeholder='Your Post Caption' maxLength={100} onChange={(e) => setCaption(e.target.value)} />
            </div>
            <div className="createPostRadioBtn">
              <label id='post' required>Media Type</label>
              <div className='radio'>
                <div className='radioBtn'>
                  <input
                    type="radio"
                    id='post'
                    value="image"
                    checked={mediaType === 'image'}
                    onChange={handleOptionChange}
                  />
                  <label htmlFor="image">Image</label>
                </div>

                <div className='radioBtn'>
                  <input
                    type="radio"
                    id='post'
                    value="video"
                    checked={mediaType === 'video'}
                    onChange={handleOptionChange}
                  />
                  <label htmlFor="Video">Video</label>
                </div>
              </div>
            </div>
            <input type="submit" value="POST" className='primary-btn' onClick={handleSubmit} />
          </form>

        </div>
        <div className="createPostRightPanel">
          <UserDetailBox />
        </div>
      </div>
    </div>
  )
}

export default CreatePost
