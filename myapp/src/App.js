import React, {useEffect, createContext, useReducer, useContext} from 'react';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import SignIn from './components/screens/SignIn';
import SignUp from './components/screens/SignUp';
import Profile from './components/screens/Profile';
import Home from './components/screens/Home';
import CreatePost from './components/screens/CreatePost';
import { initialState,reducer } from './reducers/useReducer';
import UserProfile from './components/screens/UserProfile';
import MyFollowingPosts from './components/screens/MyFollowingPosts';

export const UserContext = createContext();

const Routing = () =>{

  const navigate = useNavigate();
  const {dispatch} = useContext(UserContext);
  //eslint-diable-next-line
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type:"USER", payload:user});
    }else{
      navigate('/signin');
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  return(
   <Routes>
            <Route path='/'element={ <Home/> } exact></Route>
            <Route path='/signin'element={ <SignIn/> } exact></Route>
            <Route path='/signup'element={ <SignUp /> } exact></Route>
            <Route path='/profile'element={ <Profile /> } exact></Route>
            <Route path='/createpost' element= {<CreatePost/>} exact></Route>
            <Route path='/profile/:userid' element= {<UserProfile/>}></Route>
            <Route path='/myfollowingposts' element= {<MyFollowingPosts/>}></Route>
    </Routes>);
}


function App() {
  const [state, dispatch] = useReducer(reducer,initialState);
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
      <Navbar/>
       <Routing/>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
