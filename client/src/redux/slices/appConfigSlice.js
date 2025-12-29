import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";






export const getMyProfile = createAsyncThunk(
        "user/getMyProfile",
        async () => {
                try {
                        const response = await axiosClient.get("api/user/myProfile")
                        return response.result;
                } catch (error) {
                        return Promise.reject(error)
                }
        }
)

export const getMyFollowSuggestion = createAsyncThunk(
    "user/getMyFollowSuggestion",
    async () => {
        try {
            const response = await axiosClient.get("/api/user/getFollowSuggestion")
            return response.result
        } catch (error) {
            return Promise.reject(error)
        }
    }
)

export const updateUserProfile = createAsyncThunk(
        "user/updateUserProfile",
        async (body) => {
                try {
                const response = await axiosClient.post("/api/user/update", body);
                return response.result
                } catch (error) {
                return Promise.reject(error)
                }
        }
)

export const deleteUserProfile = createAsyncThunk(
    "user/deleteUserProfile",
    async () => {
        try {
            const response = await axiosClient.delete("/api/user/deleteUserProfile");
            return response.result
        } catch (error) {
            return Promise.reject(error)
        }
    }
)

export const sendFollowRequest = createAsyncThunk(
    "/user/sendFollowRequest",
    async (user) => {
        try {
            const response = await axiosClient.post(`/api/user/sentFollowRequest/id=${user._id}`, {})
            response.result = { user, ...response.result }
            return response.result
        } catch (error) {
            return Promise.reject(error)
        }
    }
)
export const unFollowUser= createAsyncThunk(
    "/user/unFollowUser",
    async (user) => {
        try {
            const response = await axiosClient.post(`/api/user/unFollowUser/id=${user._id}`, {})
            response.result = { user, ...response.result }
            return response.result
        } catch (error) {
            return Promise.reject(error)
        }
    }
)

export const acceptFollowRequest = createAsyncThunk(
    "/user/acceptFollowRequest",
    async (user) => {
        try {
            const response = await axiosClient.post(`/api/user/acceptRequest/id=${user._id}`, {})
            response.result = { user, ...response.result }
            return response.result
        } catch (error) {
            return Promise.reject(error)
        }
    }
)

export const rejectFollowRequest = createAsyncThunk(
    "/user/rejectFollowRequest",
    async (user) => {
        try {
            const response = await axiosClient.post(`/api/user/rejectRequest/id=${user._id}`, {})
            response.result = { user, ...response.result }
            return response.result
        } catch (error) {
            return Promise.reject(error)
        }
    }
)




const appConfigSlice = createSlice({
        name: "appConfigSlice",
        initialState: {
                isLoading: false,
                isLoggedIn: false,
                myProfile: {},
                myFollowSuggestions: [],
                onlineUsers:[],
                socket:null
        },
        reducers: {
                setLoading: (state, action) => {
                        state.isLoading = action.payload
                },
                setIsLoggedIn: (state, action) => {
                        state.isLoggedIn = action.payload    
                },
                setMyProfileEmpty: (state, action) => {
                        state.myProfile = {}
                },

                setMyFollowSuggestionEmpty: (state, action) => {
                        state.myFollowSuggestions = []
                },
                 setOnlineUsers:(state,action)=>{
                        console.log(1221212,action.payload)
                        state.onlineUsers = action.payload
                },
                setSocket:(state,action)=>{
                        state.socket = action.payload
                },
                connectSocket:(state,action)=>{
                        
                },
                disconnectSocket:(state,_action)=>{
                },
               
                subscribeToFollowRequest:(state,action)=>{
                        
                },
                unsubscribeToFollowRequest:(state)=>{
                        
                },
                addFollowRequest:(state,action)=>{

                        const requestedUser = state.myProfile.followRequest.find((user) => user._id === action.payload._id)
                        if(requestedUser) return
                                state.myProfile.followRequest.unshift(action.payload);
                },
                acceptFollowRequestSubscribe:(state,action)=>{

                },
                acceptFollowRequestUnsubscribe:(state,action)=>{
                        
                },
                rejectFollowRequestSubscribe:(state,action)=>{

                },
                rejectFollowRequestUnsubscribe:(state,action)=>{

                },
                followRejectUser:(state,action)=>{
                        const {userFR,type} = action.payload
                        console.log(userFR,type)
                        switch(type){
                                case "FOLLOW REQUEST REJECTED":
                                        state.myProfile.followingRequest = state.myProfile.followingRequest.filter((user) => user._id !== userFR._id)
                                        break;
                                case "FOLLOW REQUEST ACCEPTED":
                                        state.myProfile.followingRequest = state.myProfile.followingRequest.filter((user) => user._id !==userFR._id)
                                        state.myProfile.followings.push(userFR)
                                        break;
                        }
                },
                subscribeToUnfollowRequest:(state,action)=>{

                },
                unsubscribeToUnfollowRequest:(state,action)=>{
                        

                },
                handleUnfollowState:(state,action)=>{
                        // remove that user from follower and followings
                        const userToUnfollow = action.payload

                        state.myProfile.followers = state.myProfile.followers.filter((user) => user._id !== userToUnfollow._id)
                        state.myProfile.followings = state.myProfile.followings.filter((user) => user._id !== userToUnfollow._id)
                }

        },
        extraReducers: function (builder) {
                builder
                .addCase(getMyProfile.fulfilled, (state, action) => {
                        state.myProfile = action.payload.user
                        state.isLoggedIn = true
                }).
                addCase(getMyProfile.rejected, (state, action) => {
                        state.isLoggedIn = false
                        state.myProfile = {}
                })
                .addCase(getMyFollowSuggestion.fulfilled, (state, action) => {
                        state.myFollowSuggestions = action.payload.followSuggestions
                })
                .addCase(updateUserProfile.fulfilled, (state, action) => {
                        state.myProfile = action.payload.updatedUser
                })
                .addCase(deleteUserProfile.fulfilled, (state, action) => {

                })
                .addCase(sendFollowRequest.fulfilled, (state, action) => {

                        state.myFollowSuggestions = state.myFollowSuggestions?.filter((user) => {
                        return user._id !== action.payload.user?._id
                        })

                        state.myProfile.followingRequest.push(action.payload.user)


                })
                .addCase(unFollowUser.fulfilled, (state, action) => {

                        state.myFollowSuggestions.push(action.payload.user)

                        state.myProfile.followerRequest = state.myProfile.followerRequest?.filter((user) => {
                                return user._id !== action.payload.user._id
                        })

                        state.myProfile.followings = state.myProfile.followings?.filter((user) => {
                                return user._id !== action.payload.user._id
                        })

                        state.myProfile.followers = state.myProfile.followers?.filter((user) => {
                                return user._id !== action.payload.user._id
                        })


                })
                .addCase(acceptFollowRequest.fulfilled, (state, action) => {

                        // remove this userId from current_user followRequest
                        state.myProfile.followRequest = state.myProfile.followRequest?.filter((user) => {
                        return user._id !== action.payload.user._id
                        })


                        // add this userId to current user followers if not included
                        if (!state.myProfile.followers?.includes(action.payload.user._id)) {
                        state.myProfile.followers.push(action.payload.user)
                        }



                })
                .addCase(rejectFollowRequest.fulfilled, (state, action) => {

                        // remove this userId from current_user followRequest
                        state.myProfile.followRequest = state.myProfile.followRequest?.filter((user) => {
                        return user._id !== action.payload.user._id
                        })



                })
        }
})


export default appConfigSlice.reducer

export const {
        setSocket,
        setOnlineUsers, 
        setLoading, 
        setToastData, 
        setIsLoggedIn, 
        setMyProfileEmpty, 
        setMyFollowSuggestionEmpty,
        connectSocket,
        disconnectSocket,
        subscribeToFollowRequest,
        unsubscribeToFollowRequest,
        addFollowRequest,
        acceptFollowRequestSubscribe,
        acceptFollowRequestUnsubscribe,
        rejectFollowRequestSubscribe,
        rejectFollowRequestUnsubscribe,
        followRejectUser,
        subscribeToUnfollowRequest,
        unsubscribeToUnfollowRequest,
        handleUnfollowState
} = appConfigSlice.actions