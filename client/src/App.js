
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import RequireUser from './components/RequireUser';
import Home from './pages/home/Home';
import OnlyIfUserNotLoggedIn from './components/OnlyIfUserNotLoggedIn';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Feed from './components/feed/Feed';
import { useEffect } from 'react';
import ShowImages from './components/showPosts/ShowImages';
import ShowVideos from './components/showPosts/ShowVideos';
import  { Toaster } from 'react-hot-toast';

import Notification from './components/notifications/Notification';
import CreatePost from './components/createPost/CreatePost';
import UserProfile from './components/userProfile/UserProfile';
import UpdateUserProfile from './components/updateUserProfile/UpdateUserProfile';
import { connectSocket, getMyProfile } from './redux/slices/appConfigSlice';
import { useDispatch, useSelector } from 'react-redux';


function App() {

        const dispatch = useDispatch()
        const {isLoggedIn} = useSelector(store=>store.appConfigReducer)

        useEffect(() => {
                
                const checkAuth =async()=>dispatch(getMyProfile())
                if(!isLoggedIn){
                         checkAuth() 
                }
                       
        },[dispatch, isLoggedIn])

        return (
                <div className="App">

                <Toaster/>

                <Routes >
                        <Route path='/' element={<RequireUser />}>
                                <Route element={<Home />}>
                                        <Route path='/' element={<Feed />}>
                                        <Route path='/feed' element={<ShowImages />} />
                                        <Route path='/feed/images' element={<ShowImages />} />
                                        <Route path='/feed/videos' element={<ShowVideos />} />
                                 </Route>
                                <Route path='/user/notification' element={<Notification />} />
                                <Route path='/user/post/create' element={<CreatePost />}/>
                                <Route path='/user/profile/:userId' element={<UserProfile />} >
                                        <Route path = "/user/profile/:userId" element={<ShowImages />}/>
                                        <Route path = "/user/profile/:userId/post/image" element={<ShowImages />}/>
                                        <Route path = "/user/profile/:userId/post/video" element={<ShowVideos />}/>
                                </Route>
                                <Route path="/user/update/:userId" element={<UpdateUserProfile />}  />
                                </Route>
                        </Route>

                                <Route path='/' element={<OnlyIfUserNotLoggedIn />}>
                                <Route path='/login' element={<Login />} />
                                <Route path='/signup' element={<Signup />} />
                        </Route>

                </Routes>
                </div>
        );
}

export default App;
