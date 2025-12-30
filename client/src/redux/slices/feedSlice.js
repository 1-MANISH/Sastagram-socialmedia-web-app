import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import {addAComment} from "../slices/postSlice"

export const getFeedData = createAsyncThunk(
    "feed/getFeedData",
    async()=>{
        try {
            const response = await axiosClient.get("/api/user/getFeedData")
            return response.result
        } catch (error) {
            return Promise.reject(error)
        }
    }
)

export const commentOnPostForFeedPost = createAsyncThunk(
    "feed/CommentOnPost",
    async(body,{dispatch,getState})=>{
        try {
            const response = await axiosClient.post(`/api/post/commentOnPost/id=${body.postId}`,{message:body.message})
            response.body = body
            const {myProfile} = getState().appConfigReducer
            dispatch(addAComment({
                    message:body.message,
                    commentedAt:Date.now(),
                    commentBy:myProfile
            }))
            return response
        } catch (error) {

            return Promise.reject(error)
        }
    }
)

export const likeOnPostForFeedPost = createAsyncThunk(
    "feed/likeOnPost",
    async(body)=>{
        try {
            const response = await axiosClient.post(`/api/post/likeOrUnlikePost/id=${body.postId}`)
            response.result.postId = body.postId
            response.result.currentUserId = body.currentUserId
            return response.result
        } catch (error) {

            return Promise.reject(error)
        }
    }
)

const feedSlice = createSlice({
        name:"feedSlice",
        initialState:{
                feedData:[]
        },
        reducers:{
                setFeedDataEmpty:(state,action)=>{
                        state.feedData=[]
                },
                subscribeToLikeDislikePost:(state,action)=>{

                },
                unsubscribeToLikeDislikePost:(state,action)=>{
                        
                },
                addLikeUpdateToPost:(state,action)=>{
                        const {post,status,userId} = action.payload

                        const index = state.feedData.findIndex((feed)=>feed._id === post._id)
                        if(index!==-1){
                                 if(status){
                                        // post liked
                                        state.feedData[index].likedBy.push(userId)
                                }else{
                                        // post disliked
                                        state.feedData[index].likedBy = state.feedData[index].likedBy.filter((id)=>id!==userId)
                                }
                        }
                       
                },
                subscribeToPostComment:(state,action)=>{

                },
                unsubscribeToPostComment:(state,action)=>{
                        
                },
                updateLiveComment:(state,action)=>{
                        const {postId,comment,userId} = action.payload

                        const index = state.feedData.findIndex((feed)=>feed._id === postId)
                        if(index!==-1){
                                state.feedData[index].comment.splice(0,0,comment)
                        }
                },
                subscribeToPostCreated:(state,action)=>{

                },
                unsubscribeToPostCreated:(state,action)=>{
                        
                },
                addLivePostCreated:(state,action)=>{
                        const {post} = action.payload
                        state.feedData.splice(0,0,post)
                }
        },
        extraReducers:function(builder){
                builder
                .addCase(getFeedData.fulfilled,(state,action)=>{
                        state.feedData = action.payload.allPosts     
                })
                .addCase(commentOnPostForFeedPost.fulfilled,(state,action)=>{

                        const postId = action.payload.body.postId
                        const message = action.payload.body.message
                        // first find post which current user commented
                        const index = state.feedData.findIndex((feed)=>feed._id === postId)

                        if(index!==-1){
                                state.feedData[index].comment.push({
                                        message:message,
                                        commentedAt:Date.now()
                                })
                        }

                        // also add this comment to posts comments array in postslice
                
                })
                .addCase(likeOnPostForFeedPost.fulfilled,(state,action)=>{
                        const postId = action.payload.postId
                        const currentUserId = action.payload.currentUserId
                        const postIndex = state.feedData.findIndex((post)=>post._id === postId)
                        if(action.payload.postLikeStatus === "POST LIKED 💖"){
                                if(postIndex !== -1){
                                state.feedData[postIndex].likedBy.push(currentUserId)
                                state.feedData[postIndex].isLiked = !(state.feedData[postIndex].isLiked)
                                
                                }
                        }else{
                                if(postIndex !== -1){
                                state.feedData[postIndex].likedBy = state.feedData[postIndex].likedBy.filter((userId)=> userId !== currentUserId)
                                state.feedData[postIndex].isLiked = !(state.feedData[postIndex].isLiked)
                                
                                }
                        }

                })
        }
})


export default feedSlice.reducer

export const {
        setFeedDataEmpty,
        subscribeToLikeDislikePost,
        unsubscribeToLikeDislikePost,
        addLikeUpdateToPost,
        subscribeToPostComment,
        unsubscribeToPostComment,
        updateLiveComment,
        subscribeToPostCreated,
        unsubscribeToPostCreated,
        addLivePostCreated

} = feedSlice.actions

