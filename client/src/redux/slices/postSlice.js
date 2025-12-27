import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";




export const getUserProfile = createAsyncThunk(
    "post/getUserProfile",
    async (userId) => {
        try {
            const response = await axiosClient.get(`/api/user/id=${userId}`)
            return response.result
        } catch (error) {
            return Promise.reject(error)
        }
    }
)

export const createPost = createAsyncThunk(
    "post/create",
    async (body) => {
        try {
            const response = await axiosClient.post("/api/post/createPost", body.body)

            return response.result
        } catch (error) {

            return Promise.reject(error)
        }
    }
)

export const likeOrDisLikeUserPost = createAsyncThunk(
    "post/likeOrDisLikeUserPost",
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

export const commentOnPost = createAsyncThunk(
    "post/CommentOnPost",
    async(body,{getState})=>{
            try {

                const response = await axiosClient.post(`/api/post/commentOnPost/id=${body.postId}`,{message:body.message})
                const {myProfile} = getState()?.appConfigReducer
                response.body = body
                response.currentUser=myProfile
                return response
            } catch (error) {

                return Promise.reject(error)
            }
    }
)

export const getPostComment  = createAsyncThunk(
    "post/getComment",
    async(postId)=>{
        try {
            const response = await axiosClient.get(`/api/post/getPostComment/id=${postId}`)
            return response.result
        } catch (error) {
            return Promise.reject(error)
        }
    }
)

export const updatePost = createAsyncThunk(
    "post/updatePost",
    async(body)=>{
        try {
            const response = await axiosClient.put(`/api/post/updatePost/id=${body.post._id}`,
                {
                    title:body.post.title,
                    caption:body.post.caption
                }
            )

            return response.result.postUpdated
          
        } catch (error) {

            return Promise.reject(error)
        }
    }
)

const postSlice = createSlice({
        name: "postSlice",
        initialState: {
                userProfile: {},
                postComments:[]
        },
        reducers: {
                setUserProfileEmpty: (state, action) => {
                        state.userProfile = {}
                },
                addAComment:(state,action)=>{
                        state.postComments.splice(0,0,action.payload)
                }
        },
        extraReducers: function (builder) {
                builder
                .addCase(getUserProfile.fulfilled, (state, action) => {
                        state.userProfile = action.payload.user
                })
                .addCase(createPost.fulfilled, (state, action) => {
                        state.userProfile.postCreated.push({isLiked:false,...action.payload.postCreated})
                })
                .addCase(updatePost.fulfilled,(state,action)=>{

                        const updatedPost = action.payload

                        // find post
                        const index = state.userProfile.postCreated.findIndex((post)=>{
                        return post._id === updatedPost._id
                        })

                        state.userProfile.postCreated[index] = updatedPost
                })
                .addCase(likeOrDisLikeUserPost.fulfilled,(state,action)=>{
                        const postId = action.payload.postId
                        const currentUserId = action.payload.currentUserId
                        const postIndex = state.userProfile.postCreated.findIndex((post)=>post._id === postId)

                        if(action.payload.postLikeStatus === "POST LIKED 💖"){
                                if(postIndex !== -1){
                                        state.userProfile.postCreated[postIndex].likedBy.push(currentUserId)
                                        state.userProfile.postCreated[postIndex].isLiked = !(state.userProfile.postCreated[postIndex].isLiked)
                                        state.userProfile.postLiked.push(postId)
                                }
                                }else{
                                        if(postIndex !== -1){
                                                state.userProfile.postCreated[postIndex].likedBy = state.userProfile.postCreated[postIndex].likedBy.filter((userId)=> userId !== currentUserId)
                                                state.userProfile.postCreated[postIndex].isLiked = !(state.userProfile.postCreated[postIndex].isLiked)
                                                state.userProfile.postLiked = state.userProfile.postLiked.filter((id)=>id !== postId)
                                        }
                                }

                        
                })
                .addCase(commentOnPost.fulfilled,(state,action)=>{
                        const postId = action.payload.body.postId
                        const message = action.payload.body.message
                        // first find post which current user commented
                        const index = state.userProfile.postCreated.findIndex((post)=>post._id === postId)
                      
                        if(index!==-1){
                                state.userProfile.postCreated[index].comment.concat({message:message,commentBy:action.payload.currentUser,commentedAt:Date.now()})
                        }
                       
                        // also in post comments- add
                        state.postComments.splice(0,0,{commentBy:action.payload.currentUser,message:message,commentedAt:Date.now()})
                        console.log(12,state.postComments.length);
                        
                        
                })
                .addCase(getPostComment.fulfilled,(state,action)=>{
                        state.postComments = action.payload.comments
                })
        }

})


export default postSlice.reducer

export const { setUserProfileEmpty,addAComment } = postSlice.actions