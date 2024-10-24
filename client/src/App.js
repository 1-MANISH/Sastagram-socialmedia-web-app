
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import RequireUser from './components/RequireUser';
import Home from './pages/home/Home';
import OnlyIfUserNotLoggedIn from './components/OnlyIfUserNotLoggedIn';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Feed from './components/feed/Feed';
import { useEffect, useRef } from 'react';
import ShowImages from './components/showPosts/ShowImages';
import ShowVideos from './components/showPosts/ShowVideos';
import toast, { Toaster } from 'react-hot-toast';
import LoadingBar from 'react-top-loading-bar';
import { useSelector } from 'react-redux';
import Notification from './components/notifications/Notification';
import CreatePost from './components/createPost/CreatePost';
import UserProfile from './components/userProfile/UserProfile';
import UpdateUserProfile from './components/updateUserProfile/UpdateUserProfile';
export const TOAST_SUCCESS = 'toast_success'
export const TOAST_FAILURE = 'toast_failure'

function App() {

  const isLoading = useSelector(state => state.appConfigReducer.isLoading)
  const toastData = useSelector(state => state.appConfigReducer.toastData)
  const loadingRef = useRef(null)



  // loading bar + For Toast

  useEffect(() => {
    const toastType = toastData?.type
    const toastMessage = toastData?.message

    if (isLoading) {
      loadingRef.current?.continuousStart()
    } else {
      loadingRef.current?.complete()
    }

    switch (toastType) {
      case TOAST_SUCCESS:
        toast.success(toastMessage)
        break
      case TOAST_FAILURE:
        toast.error(toastMessage)
        break
      default:
        break
    }
  }, [toastData,isLoading])

  return (
    <div className="App">

      <LoadingBar color='#f11946' ref={loadingRef} />
      <Toaster/>

      <Routes >
        <Route element={<RequireUser />}>
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
