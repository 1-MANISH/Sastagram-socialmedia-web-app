import React from 'react'
import "./Notification.scss"
import UserDetailBox from '../userDetailsBox/UserDetailBox'
import FollowRequestCard from '../followCard/FollowRequestCard'
import FollowingRequestCard from '../followCard/FollowingRequestCard'
import { useSelector } from 'react-redux'

function Notification() {


  const currentUser = useSelector(store=>store.appConfigReducer.myProfile)
  


  return (
    <div className='notification'>
       <div className='container'>
            <div className='notificationLeftPanel'>
                <div className='followRequest'>
                      <h3 className='fHeading'>Follow Request</h3>

                      {
                        currentUser?.followRequest?.map((user)=>{
                          return <FollowRequestCard key={user._id} user={user} />
                        })
                      }
                      
                </div>
                <div className='followingRequest'>
                      <h3 className='fHeading'>Following Request</h3>

                      {
                        currentUser?.followingRequest?.map((user)=>{
                            return <FollowingRequestCard key={user._id} user={user} />
                        })
                      }
                     
                </div>
            </div>
            <div className='notificationRightPanel'>
                <UserDetailBox user={currentUser}/>
                
            </div>
       </div>
    </div>
  )
}

export default Notification
