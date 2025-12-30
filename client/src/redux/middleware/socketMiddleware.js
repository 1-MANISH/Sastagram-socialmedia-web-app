import { ACCEPT_REQUEST, FOLLOW_REQUEST, GET_ONLINE_USERS, POST_COMMENT, POST_CREATED, POST_LIKED_STATUS, REJECT_REQUEST,UNFOLLOW_REQUEST } from "../../utils/events"
import { acceptFollowRequestSubscribe, acceptFollowRequestUnsubscribe, addFollowRequest, connectSocket, disconnectSocket, followRejectUser, getMyProfile, handleUnfollowState, rejectFollowRequestSubscribe, rejectFollowRequestUnsubscribe, setOnlineUsers, setSocket, subscribeToFollowRequest, subscribeToUnfollowRequest, unsubscribeToFollowRequest, unsubscribeToUnfollowRequest } from "../slices/appConfigSlice"
import {io} from "socket.io-client";
import { addLikeUpdateToPost, subscribeToLikeDislikePost, subscribeToPostComment, unsubscribeToLikeDislikePost, unsubscribeToPostComment, updateLiveComment ,subscribeToPostCreated,
        unsubscribeToPostCreated,
        addLivePostCreated} from "../slices/feedSlice";
import { addLikeUpdateToUserPost, addLiveUserPostCreated, updateLiveUserComment } from "../slices/postSlice";

// async operations

const BASE_URL = process.env.REACT_MODE === "development" ?process.env.REACT_APP_SERVER_BASE_URL :process.env.REACT_APP_SERVER_BASE_URL

export const socketMiddleware  = (store )=> (next)=>(action)=>{

        const state = store.getState().appConfigReducer;

        // auto connect after getMyProfile called
        
        if(action.type === getMyProfile.fulfilled.type){
                const isLoggedIn = !!action.payload?.user?._id;

                if(isLoggedIn){
                        store.dispatch(connectSocket())
                }
        }

        const {socket} = store.getState().appConfigReducer
       
        if(action.type === connectSocket.type)
        {
                if(!socket)
                {
                        try 
                        {
                                if( socket) return          
                                const socketInstance = io(
                                                BASE_URL,
                                        {
                                                withCredentials: true
                                        }
                                )
                                socketInstance.connect()
                                
                                socketInstance.connect()

                                store.dispatch(setSocket(socketInstance))

                                // listen for online users
                                socketInstance.on(GET_ONLINE_USERS,(userIds)=>{
                                        // i wants to set onlineUsers = userIds
                                        store.dispatch(setOnlineUsers(userIds))
                                                
                                })

                        } catch (error) {
                                        console.log(`Error connecting socket: ${error}`)
                        }                                
                }
                        

               
        }

        if(action.type === disconnectSocket.type){
                if(socket){
                        try {
                                if(socket?.connected) 
                                        socket.disconnect()
                                        store.dispatch(setSocket(null))
                                } catch (error) {
                                        console.log(`Error disconnecting socket: ${error}`)
                                }
                }
        }

        if(action.type === subscribeToFollowRequest.type){
                try{
                        // listen to any upcoming follow request for this user
                        const myUserId = state.myProfile?._id

                        if(!socket || !myUserId) return

                        socket.on(FOLLOW_REQUEST,(user)=>{

                                 if(user._id === myUserId)return

                                store.dispatch(addFollowRequest(user)) 
                         })

                } catch(error){
                        console.log(`Error subscribing from followRequest: ${error}`)
                 } 
        }
        if(action.type === unsubscribeToFollowRequest.type){
                try{
                        if(!socket) return
                                socket.off(FOLLOW_REQUEST)
                }catch(error){
                        console.log(`Error unsubscribing from followRequest: ${error}`)
                }
        }
        if(action.type === subscribeToUnfollowRequest.type){
                try{
                        // listen to any upcoming follow request for this user
                        const myUserId = state.myProfile?._id

                        if(!socket || !myUserId) return

                        socket.on(UNFOLLOW_REQUEST,(user)=>{

                                //  if(user._id === myUserId)return

                                store.dispatch(handleUnfollowState(user)) 
                         })

                } catch(error){
                        console.log(`Error subscribing from followRequest: ${error}`)
                 } 
        }
        if(action.type === unsubscribeToUnfollowRequest.type){
                try{
                        if(!socket) return
                                socket.off(UNFOLLOW_REQUEST)
                }catch(error){
                        console.log(`Error unsubscribing from followRequest: ${error}`)
                }
        }
        if(action.type === acceptFollowRequestSubscribe.type){
                try{
                        // listen to any upcoming follow request for this user
                        const myUserId = state.myProfile?._id

                        if(!socket || !myUserId) return

                        socket.on(ACCEPT_REQUEST,(user)=>{

                                 if(user._id === myUserId)return

                                store.dispatch(followRejectUser({userFR:user,type:"FOLLOW REQUEST ACCEPTED"})) 
                         })

                } catch(error){
                        console.log(`Error subscribing from followRequest accept: ${error}`)
                 } 
        }
        if(action.type === acceptFollowRequestUnsubscribe.type){
                try{
                        if(!socket) return
                                socket.off(ACCEPT_REQUEST)
                }catch(error){
                        console.log(`Error unsubscribing from followRequest accept: ${error}`)
                }
        }
        if(action.type === rejectFollowRequestSubscribe.type){
                try{
                        // listen to any upcoming follow request for this user
                        const myUserId = state.myProfile?._id

                        if(!socket || !myUserId) return

                        socket.on(REJECT_REQUEST,(user)=>{

                                 if(user._id === myUserId)return

                                store.dispatch(followRejectUser({userFR:user,type:"FOLLOW REQUEST REJECTED"})) 
                         })

                } catch(error){
                        console.log(`Error subscribing from followRequest reject: ${error}`)
                 } 
        }
        if(action.type === rejectFollowRequestUnsubscribe.type){
                 try{
                        if(!socket) return
                                socket.off(REJECT_REQUEST)
                }catch(error){
                        console.log(`Error unsubscribing from followRequest reject: ${error}`)
                }
        }
        if(action.type === subscribeToLikeDislikePost.type){
                try{
                        // listen to any upcoming follow request for this user
                        const myUserId = state.myProfile?._id

                        if(!socket || !myUserId) return

                        socket.on(POST_LIKED_STATUS,({post,userId,status})=>{


                                 if(userId === myUserId)return

                                store.dispatch(addLikeUpdateToPost({post,status,userId})) 
                                store.dispatch(addLikeUpdateToUserPost({post,status,userId}))
                         })

                } catch(error){
                        console.log(`Error subscribing from likeDislike: ${error}`)
                 } 
        }
        if(action.type === unsubscribeToLikeDislikePost.type){
                  try{
                        if(!socket) return
                                socket.off(POST_LIKED_STATUS)
                }catch(error){
                        console.log(`Error unsubscribing from likeDislike: ${error}`)
                }
        }
        if(action.type === subscribeToPostComment.type){
                try{
                        // listen to any upcoming follow request for this user
                        const myUserId = state.myProfile?._id

                        if(!socket || !myUserId) return

                        socket.on(POST_COMMENT,({postId,comment,userId})=>{
                                 if(userId === myUserId)return

                                store.dispatch(updateLiveComment({postId,comment,userId})) 
                                store.dispatch(updateLiveUserComment({postId,comment,userId}))
                         })

                } catch(error){
                        console.log(`Error subscribing from comment: ${error}`)
                 } 
        }
        if(action.type === unsubscribeToPostComment.type){
                  try{
                        if(!socket) return
                                socket.off(POST_COMMENT)
                }catch(error){
                        console.log(`Error unsubscribing from comment: ${error}`)
                }
        }

        if(action.type === subscribeToPostCreated.type){
                try{
                        // listen to any upcoming follow request for this user
                        const myUserId = state.myProfile?._id

                        if(!socket || !myUserId) return

                        socket.on(POST_CREATED,({post,userId})=>{

                                if(userId === myUserId)return


                                store.dispatch(addLivePostCreated({post,userId})) 
                                store.dispatch(addLiveUserPostCreated({post,userId}))
                         })

                } catch(error){
                        console.log(`Error subscribing from comment: ${error}`)
                 } 
        }
        if(action.type === unsubscribeToPostCreated.type){
                  try{
                        if(!socket) return
                                socket.off(POST_CREATED)
                }catch(error){
                        console.log(`Error unsubscribing from comment: ${error}`)
                }
        }
        return next(action)
}