import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { TOAST_SUCCESS } from "../../App";

// async operations

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
        toastData: {
            // type
            // message
        },
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        setToastData: (state, action) => {
            state.toastData = action.payload
        },
        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload
        },
        setMyProfileEmpty: (state, action) => {
            state.myProfile = {}
        },
        setMyFollowSuggestionEmpty: (state, action) => {
            state.myFollowSuggestions = []
        }
    },
    extraReducers: function (builder) {
        builder
            .addCase(getMyProfile.fulfilled, (state, action) => {
                state.myProfile = action.payload.user
            })
            .addCase(getMyFollowSuggestion.fulfilled, (state, action) => {
                state.myFollowSuggestions = action.payload.followSuggestions
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.myProfile = action.payload.updatedUser
                state.toastData = {
                    type: TOAST_SUCCESS,
                    message: "User Deatails Updated 👍"
                }
            })
            .addCase(deleteUserProfile.fulfilled, (state, action) => {
                state.toastData = {
                    type: TOAST_SUCCESS,
                    message: action.payload
                }
            })
            .addCase(sendFollowRequest.fulfilled, (state, action) => {

                state.myFollowSuggestions = state.myFollowSuggestions?.filter((user) => {
                    return user._id !== action.payload.user?._id
                })

                state.myProfile.followingRequest.push(action.payload.user)

                state.toastData = {
                    type: TOAST_SUCCESS,
                    message: action.payload.requestStatus
                }
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

                state.toastData = {
                    type: TOAST_SUCCESS,
                    message: action.payload.requestStatus
                }

            })
            .addCase(rejectFollowRequest.fulfilled, (state, action) => {

                // remove this userId from current_user followRequest
                state.myProfile.followRequest = state.myProfile.followRequest?.filter((user) => {
                    return user._id !== action.payload.user._id
                })

                state.toastData = {
                    type: TOAST_SUCCESS,
                    message: action.payload.requestStatus
                }

            })
    }
})


export default appConfigSlice.reducer

export const { setLoading, setToastData, setIsLoggedIn, setMyProfileEmpty, setMyFollowSuggestionEmpty } = appConfigSlice.actions