import React, { useEffect, useState } from 'react'
import "./UpdateUserProfile.scss"
import userImage from "../../assets/images/user.png"
import { useDispatch, useSelector } from 'react-redux'
import { deleteUserProfile, setIsLoggedIn, setMyFollowSuggestionEmpty, setMyProfileEmpty, updateUserProfile } from '../../redux/slices/appConfigSlice'



function UpdateUserProfile() {

  const myProfile = useSelector(store => store.appConfigReducer.myProfile)

  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [avatarImage, setAvatarImage] = useState("")

  const dispatch = useDispatch()


  useEffect(() => {
    setName(myProfile?.name || "")
    setBio(myProfile?.bio || "")
    setAvatarImage(myProfile?.avatar?.url || "")
  }, [myProfile])

  const handleImageChange = async (e) => {
    e.preventDefault()
      try {
         
        const file = e.target.files[0] // our file
        const fileReader = new FileReader() // for base 64 encoded
        fileReader.readAsDataURL(file)

        fileReader.onload = () => {
          if(fileReader.readyState === fileReader.DONE){
              setAvatarImage(fileReader.result)
          }
        }
       
      } catch (error) {
        console.log("update User image error : "+error.message);
      }
  }

  const handleSubmit = async (e) => {
      e.preventDefault()
      try {
          dispatch(updateUserProfile({
            name,
            bio,
            avatarImage
          }))
          
      } catch (error) {
        console.log("update User error : "+error.message);
      }
  }

  const handleDeleteAccountHandler =  async() => {
      try {
          
        dispatch(deleteUserProfile())
        dispatch(setIsLoggedIn(false))
        dispatch(setMyProfileEmpty())
        dispatch(setMyFollowSuggestionEmpty())
        window.location.replace("/signup","_self")
      } catch (error) {
         console.log("Delete user error : "+error.message)
      }
  }

  return (
    <div className='updateUserProfile'>
      <div className='container'>
        <div className="left-part">
          <div className="input-user-img">
            <label htmlFor="inputImg" className='labelImg'>
              <img src={avatarImage ? avatarImage : userImage} alt={myProfile?.name} className='userImg' />
            </label>
            <input
              className='inputImg'
              id='inputImg'
              type="file"
              accept='image/*'
              onChange={handleImageChange}
            />
          </div>

        </div>

        <div className="right-part">
          <form onSubmit={handleSubmit}>
            <input type="text" value={name} placeholder='Your Name' onChange={(e) => setName(e.target.value)} />
            <input type="text" value={bio} placeholder='Your Bio' onChange={(e) => setBio(e.target.value)} />
            <input type="submit" className='primary-btn' onClick={handleSubmit}  />
          </form>
          <button  className='secondary-btn ' onClick={handleDeleteAccountHandler} >Delete Account</button>
        </div>
      </div>
    </div>
  )
}

export default UpdateUserProfile

