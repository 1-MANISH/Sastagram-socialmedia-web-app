import React, { useEffect, useState } from 'react'
import "./ShowPost.scss"
import { useSelector } from 'react-redux';
import ShowImagePost from '../showPost/ShowImagePost';
import { useParams } from 'react-router-dom';

function ShowImages() {

  const[showFeed,setShowFeed] = useState(true)
  const param = useParams()

  useEffect(()=>{
    if(!param.userId){
      setShowFeed(true)
    }else{
      setShowFeed(false)
    }
  },[param.userId])

  const userPost = useSelector(store=>store.postReducer.userProfile).postCreated
  const feedData = useSelector(store=>store.feedReducer.feedData)
  return (
    <div className='showImages'>
        {
          showFeed &&
          feedData?.map((post)=>{
            if(post.mediaType === "image")
              return <ShowImagePost key={post._id} post={post} showFeed={showFeed}  />
          })
        }
        {
          !showFeed &&
          userPost?.map((post)=>{
             if(post.mediaType === "image")
               return <ShowImagePost key={post._id} post={post} showFeed={showFeed} />
          })
        }


    </div>
  )
}

export default ShowImages
