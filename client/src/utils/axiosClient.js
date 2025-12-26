import axios from "axios";


const BASE_URL = process.env.REACT_APP_SERVER_BASE_URL //process.env.REACT_APP_SERVER_BASE_URL

export const axiosClient = axios.create({
        baseURL:BASE_URL,
        withCredentials:true
})


// request interceptor : On Every request load AT to its header
axiosClient.interceptors.request.use(
        async(request)=>{
                return request
        }
)


// response interceptor
axiosClient.interceptors.response.use(

        async (response) => {


                const data = response.data


                if(data.status === "OK"){
                        return data; // response as previous directly we can get
                } 

                const originalRequest = response.config
                const statusCode = data.statusCode
                const errorMessage = data.message

                // AT expires
                if((statusCode === 401 && errorMessage === "jwt expired") && !originalRequest._retry){

                        originalRequest._retry = true
                        // get refresh token
                        const resultResponse = await axios.create(
                                {
                                        withCredentials:true
                                }
                        ).get(`${BASE_URL}/auth/refresh`)

                        // if successfully get new AT : call api using new AT

                        if(resultResponse.data.status === "OK"){
                                return (await axios(originalRequest)).data
                        }
                        else{
                                // RT expires
                                window.location.replace("/login","_self")
                                return Promise.reject(errorMessage)
                        }
                }
                return Promise.reject(errorMessage)
        },
        async (error) => {

                return Promise.reject(error.message)
        }
)