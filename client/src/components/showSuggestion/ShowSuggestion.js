import React from 'react'
import "./ShowSuggestion.scss"
import { MdOutlineFollowTheSigns } from "react-icons/md";
import FollowCard from '../followCard/FollowCard';
import { useSelector } from 'react-redux';

function ShowSuggestion() {

   
  const myFollowSuggestions = useSelector(store=>store.appConfigReducer.myFollowSuggestions)

  return (
    <div className='showSuggestion'>
          <div className='suggestionHeading'>
             <span className='suggestionHeadingIcon'><MdOutlineFollowTheSigns className='icon' /></span>
             <span className='suggestionHeadingText'>Follow Suggestions</span>
          </div>
          <div className='suggestion'>
            {
              myFollowSuggestions &&

              myFollowSuggestions?.map((user)=>{
                return <FollowCard key={user?._id} user={user}/>
              })
            }
              
             
          </div>
    </div>
  )
}

export default ShowSuggestion
