import { ACCEPT_REQUEST, FOLLOW_REQUEST, GET_ONLINE_USERS, REJECT_REQUEST,UNFOLLOW_REQUEST } from "../../utils/events"
import { acceptFollowRequestSubscribe, acceptFollowRequestUnsubscribe, addFollowRequest, connectSocket, disconnectSocket, followRejectUser, getMyProfile, handleUnfollowState, rejectFollowRequestSubscribe, rejectFollowRequestUnsubscribe, setOnlineUsers, setSocket, subscribeToFollowRequest, subscribeToUnfollowRequest, unsubscribeToFollowRequest, unsubscribeToUnfollowRequest } from "../slices/appConfigSlice"
import {io} from "socket.io-client";

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
        return next(action)
}