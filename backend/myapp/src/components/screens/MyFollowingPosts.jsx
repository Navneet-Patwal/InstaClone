import React, {useEffect,useState,useContext} from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
const MyFollowingPosts = () => {
    const[data, setData] = useState([]);
    const {state} = useContext(UserContext);
    useEffect(()=>{
         fetch("/followingposts",{
         headers:{
            "Authorization" : "Bearer " + localStorage.getItem("jwt")
             }
        }).then(res=>{ return res.json();})
        .then(results=>{
        setData(results.posts)})    
    },[data])

    const likePost = (id) =>{
        fetch('/likes',
        {   method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId:id
            })
            
        }).then(res=>res.json())
        .then(results=>{
            const newData = data.map(item=>{
                if(item._id===results._id){
                    return results;
                }else{
                    return item;
                }
            })
            setData(newData);
        }).catch(err=>{
            console.log(err);
        })
    }


    const unlikePost = (id) =>{
        fetch('/unlikes',
        {   method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId:id
            })
            
        }).then(res=> {return res.json()})
        .then(results=>{
            const newData = data.map(item=>{
                if(item._id===results._id){
                    return results;
                }else{
                    return item;
                }
            })
            setData(newData);
        }).catch(err=>{
            console.log(err);
        })
    }

      const makeComment = (text,postId) =>{
        fetch('/comments',{
            method:'put',
            headers:{
                "Content-Type" : "application/json",
                "Authorization" : "Bearer " + localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                text:text,
                postId:postId
            })
        }).then(res=>{
            return res.json()
        }).then(results =>{
            const newData = data.map(item=>{
                if(item._id===results._id){
                    return results;
                }else{
                    return item;
                }
            })
            setData(newData);
        }).catch(err=>{
            console.log(err);
        })
      }

      const deletePost = (postId) =>{
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization" : "Bearer " + localStorage.getItem("jwt"),
            }
        }).then(res=> {return res.json();})
        .then(result=>{
            const newData = data.filter(item=>{
                return item._id !== result._id;
            })
            setData(newData);
        })
      }

    

    return(
        <div className="home">
            {data.map((item,index)=>{
              return (  
              <div key={index} className="card home-card z-depth-0">
                <h5><Link to={item.postedBy._id !== state._id ?'/profile/'+item.postedBy._id:'/profile'}>{item.postedBy.name}</Link> {item.postedBy._id === state._id &&<i className="material-icons" style={{"float":"right"}} onClick={()=>deletePost(item._id)}>delete</i>}</h5>
                <div className="card-image">
                    <img src={item.photo} alt="post"/>
                </div>
                <div className="card-content">
                {item.likes.includes(state._id) ?<i className="material-icons" onClick={()=>unlikePost(item._id)}>favorite</i>:<i className="material-icons" onClick={()=>likePost(item._id)}>favorite_border</i>}
                <i className="material-icons">maps_ugc</i>
                    <h6>{item.likes.length}likes</h6>
                    <h6>{item.title}</h6>
                    <p>{item.body}</p>
                    {
                        item.comments.map((record, idx) =>{
                            return (
                                <h6 key={idx}><span style={{fontWeight:"500"}}>{record.postedBy.name+"  "}</span>{record.text}</h6>
                            )
                        })
                    }
                    <form onSubmit={(e)=>{ 
                        e.preventDefault()
                        makeComment(e.target[0].value, item._id)
                    }}>
                    <input type="text" placeholder="add comment"/>
                    </form>
                </div>
                </div>
              )
            })}
            </div>
            
    )
}


export default MyFollowingPosts;