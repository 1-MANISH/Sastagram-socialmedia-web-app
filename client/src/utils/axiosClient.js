import axios from "axios";
import store from "../redux/Store"
import {setLoading,setToastData} from "../redux/slices/appConfigSlice"
import { ACCESS_TOKEN_KEY, getItem, removeItem, setItem } from "./localStorageManager";
import { TOAST_FAILURE } from "../App";

const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL //process.env.REACT_APP_SERVER_BASE_URL

export const axiosClient = axios.create({
    baseURL:BASE_URL,
    withCredentials:true
})


// request interceptor : On Every request load AT to its header
axiosClient.interceptors.request.use(

    async(request)=>{
        const accessToken = getItem(ACCESS_TOKEN_KEY)
        request.headers.Authorization = `Bearer ${accessToken}`
        store.dispatch(setLoading(true))
        return request
    }

)


// response interceptor
axiosClient.interceptors.response.use(

    async (response) => {

        store.dispatch(setLoading(false))

        const data = response.data

        if(data.status === "OK"){
            return data; // response as previous directly we can get
        } 

        const originalRequest = response.config
        const statusCode = data.statusCode
        const errorMessage = data.message

        store.dispatch(setToastData({
            type:TOAST_FAILURE,
            message:errorMessage
        }))

        // AT expires
        if((statusCode === 401 && errorMessage === "jwt expired") && !originalRequest._retry){

            originalRequest._retry = true
            // get refresh token
            const resultResponse = await axios.create(
                {
                    withCredentials:true
                }
            ).get(`${BASE_URL}/auth/refresh`)

            // if successefully get new AT : call api using new AT

            if(resultResponse.data.status === "OK"){
                const newAccessToken = resultResponse.data.result.newAccessToken
                setItem(ACCESS_TOKEN_KEY,newAccessToken)
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
                return (await axios(originalRequest)).data
            }
            else{

                // RT expires
                removeItem(ACCESS_TOKEN_KEY)
                window.location.replace("/login","_self")
                return Promise.reject(errorMessage)
            }
        }
        return Promise.reject(errorMessage)
    },
    async (error) => {
        store.dispatch(setLoading(false))

        store.dispatch(setToastData({
            type:TOAST_FAILURE,
            message:error.message
        }))
        return Promise.reject(error.message)
    }
)