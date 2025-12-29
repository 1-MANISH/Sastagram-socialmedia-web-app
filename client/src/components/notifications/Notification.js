import React from 'react'
import "./Notification.scss"
import UserDetailBox from '../userDetailsBox/UserDetailBox'
import FollowRequestCard from '../followCard/FollowRequestCard'
import FollowingRequestCard from '../followCard/FollowingRequestCard'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { acceptFollowRequestSubscribe, acceptFollowRequestUnsubscribe, rejectFollowRequestSubscribe, rejectFollowRequestUnsubscribe, subscribeToUnfollowRequest, unsubscribeToUnfollowRequest } from '../../redux/slices/appConfigSlice'
import UserAvatar from '../avatar/UserAvatar'
import FollowFollowingCard from '../FollowFollowingCard/FollowFollowingCard'

function Notification() {

        const dispatch = useDispatch()
        const currentUser = useSelector(store=>store.appConfigReducer.myProfile)
        
        useEffect(()=>{
                dispatch(acceptFollowRequestSubscribe())
                dispatch(rejectFollowRequestSubscribe())
                dispatch(subscribeToUnfollowRequest())

                return ()=>{
                        dispatch(acceptFollowRequestUnsubscribe())
                        dispatch(rejectFollowRequestUnsubscribe())
                        dispatch(unsubscribeToUnfollowRequest())
                }
        },[])

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
                        <div className="middlePanel">
                                <div className="followers">
                                        <h3 className='fHeading'>
                                                Followers
                                                <span> ({currentUser?.followers?.length})</span>
                                        </h3>
                                        <div className="followList">
                                                {
                                                        currentUser?.followers?.map((user)=>{
                                                                return <FollowFollowingCard key={user._id} user={user} />
                                                        })
                                                }
                                        </div>
                                </div>
                                <div className="followings">
                                        <h3 className='fHeading'>
                                                Followings
                                                     <span> ({currentUser?.followings?.length})</span>
                                        </h3>
                                        <div className="followingList">
                                                {
                                                        currentUser?.followings?.map((user)=>{
                                                                return <FollowFollowingCard key={user._id} user={user} />
                                                        })
                                                }
                                        </div>
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
