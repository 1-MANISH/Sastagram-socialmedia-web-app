import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import {io} from "socket.io-client";
import { GET_ONLINE_USERS } from "../../utils/events";

// async operations

const BASE_URL = process.env.REACT_MODE === "development" ?process.env.REACT_APP_SERVER_BASE_URL :process.env.REACT_APP_SERVER_BASE_URL

export const getMyProfile = createAsyncThunk(
        "user/getMyProfile",
        async (_,{dispatch}) => {
                try {
                        const response = await axiosClient.get("api/user/myProfile")
                        console.log(BASE_URL,12)
                        dispatch(connectSocket())
                        return response.result;
                } catch (error) {
                        dispatch(disconnectSocket())
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
                connectSocket:(state,_action)=>{
                     
                        try {
                                const myProfile = state.myProfile
                                const socket = state.socket

                                if(!myProfile._id || socket?.connected) return
                           
                                const socketInstance = io(
                                        BASE_URL,
                                        {
                                                withCredentials: true
                                        }
                                )

                                socketInstance.connect()

                                state.socket = socketInstance

                                // listen for online users
                                 state.socket.on(GET_ONLINE_USERS,(userIds)=>{
                                        state.onlineUsers = userIds
                                })
                        } catch (error) {
                                console.log(`Error connecting socket: ${error}`)
                        }

                },
                disconnectSocket:(state,_action)=>{
                        try {
                                const socket = state.socket
                                if(socket?.connected) 
                                        socket.disconnect()
                        } catch (error) {
                                 console.log(`Error disconnecting socket: ${error}`)
                        }
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

export const { setLoading, setToastData, setIsLoggedIn, setMyProfileEmpty, setMyFollowSuggestionEmpty,connectSocket,disconnectSocket } = appConfigSlice.actions