import React, {useContext} from "react";
import { Link} from "react-router-dom";
import {UserContext} from "../App";
const Navbar = ()=> {
    const {state,dispatch} = useContext(UserContext);
    const renderLink = () =>{
        if(state){
          return [
            <Link to="/profile">Profile</Link>,
            <Link to="/createpost">Create Post</Link>,
            <Link to='/myfollowingposts'>FollowingPosts</Link>,
            <Link to='/signin'onClick={()=>{
              localStorage.clear();
              dispatch({type:"CLEAR"})
            }}>LogOut</Link>
          ]
        }else{
          return [
            <Link to="/signup">SignUp</Link>,
            <Link to="/signin">SignIn</Link>
          ]
        }
    }

    return (
        <nav className="z-depth-0">
        <div className="nav-wrapper white">
          <Link to={state ?'/':'/signin'} className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right">
           {renderLink().map((item,idx) =>{
            return<li key={idx}>{item}</li>
           })}
          </ul>
        </div>
      </nav>
    );
}

export default Navbar;