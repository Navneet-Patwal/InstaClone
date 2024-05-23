
import React, {useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { UserContext } from "../../App";
const UserProfile = () => {
    const [userprofile, setProfile] = useState(null);
    const {state,dispatch} = useContext(UserContext);
    const {userid} = useParams();
    const [showFollow , setFollow] = useState(state?!state.following.includes(userid):true);
   
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization" : "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res=>{
            return res.json();
        })
        .then(result=>{
            
            setProfile(result);
        });
    },[userid]);

    const followUser = () =>{
        fetch('/follow',{
            method:"put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                followId : userid
            })
        }).then(res=>{
            return res.json();
        }).then(data=>{
            
            dispatch({type:"UPDATE",payload:{follower:data.follower,following:data.following}});
            localStorage.setItem("user",JSON.stringify(data));
            setProfile(prevState=>{
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        follower:[...prevState.user.follower,data._id],
                    }
                }
            })
        })
        setFollow(false);
    }
    


    const unfollowUser = () =>{
        fetch('/unfollow',{
            method:"put",
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body : JSON.stringify({
                unfollowId : userid
            })
        }).then(res=>{
            return res.json();
        }).then(data=>{
            
            dispatch({type:"UPDATE",payload:{follower:data.follower,following:data.following}});
            localStorage.setItem("user",JSON.stringify(data));
            
            setProfile(prevState=>{
                const newFollower = prevState.user.follower.filter(item => item!==data._id);
                return {
                    ...prevState,
                    user:{
                        ...prevState.user,
                        follower:newFollower,
                    }
                }
            })
        })
        setFollow(true);
    }
    
    return (
        <>
        {userprofile ? (
        <div>
        <div className="row">
            <div style={{marginTop:"1rem"}}>
                <img className="circle col s6" style={{width:"120px",height:"120px",overflow:"hidden"}}
                src ={userprofile.user.pic} 
                alt="Profile"/></div>
                <div className="row col s6">
                    <h4 className="col s6" style={{textAlign:"center"}}><strong>{userprofile.user.name}</strong></h4>
                </div>
            
            <div className="row col s12 offset-s2" style={{fontSize:"1.2rem",fontWeight:"bolder"}}>
                <div className="col s3">{userprofile.posts[0].length}posts</div>
                <div className="col s3">{state? state.following.length : 0}following</div>
                <div className="col s3">{state ? state.following.length : 0} followers</div>
            </div>

            <div className="row col s12 offset-s2" style={{fontSize:"1.2rem",fontWeight:"bolder"}}>
            {showFollow ? 
            (
            <button className="btn waves-effect waves-light" onClick={()=>followUser()}>follow</button>
            ):
            (
                <button className="btn waves-effect waves-light" onClick={()=>unfollowUser()}>unfollow</button>
            )
        }  
                
            </div>
          

        <div className="row">
            {userprofile.posts[0].map((item,idx)=>{
                return <img key={idx} className="col s12 m6 l4 material-box"  src={item.photo} alt={item.title}/>
            })}
            
        </div>
    </div>
    </div>) : (<h2>Loading....</h2>)
    }
        </>
        
    )
}


export default UserProfile;