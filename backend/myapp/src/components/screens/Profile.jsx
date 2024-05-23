
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";


const Profile = () => {
    const [mypics, setPics] = useState([]);
    const {state,dispatch} = useContext(UserContext);
    const [image, setImage] = useState('');
    useEffect(()=>{
        fetch('/myposts',{
            headers:{
                "Authorization" : "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res=>{
            return res.json()})
        .then(result=>{
            setPics(result.myposts);
        })
    },[state])
    
    useEffect(()=>{
        if(image){
            const data = new FormData();
            data.append('file', image);
            data.append('upload_preset', 'ml_default');
            data.append('cloudname','dwlki730j')
    
            fetch('https://api.cloudinary.com/v1_1/dwlki730j/image/upload',{
                method:'post',
                body:data
            }).then(res =>{ return res.json()})
            .then(data => {
                
                
                fetch('/updatepic',{
                    method:"put",
                    
                        headers:{
                            "Content-Type": "application/json",
                            "Authorization" : "Bearer "+  localStorage.getItem("jwt")

                        }
                        ,
                        body:JSON.stringify({
                            pic:data.secure_url
                        })
                    
                }).then(res=>{
                    return res.json();
                }).then(result=>{
                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}));
            
                dispatch({type:"UPDATEPIC",payload:result.pic});
                })
            })

            .catch(err=> console.log(err));

        }

    },[state,image,dispatch]);



    const uploadPic = (file) =>{
        setImage(file);
       
}

    return (
      <div>
        <div className="row">
          <div style={{ marginTop: "1rem" }}>
            <img
              className="circle col s6"
              style={{ width: "120px", height: "120px", overflow: "hidden" }}
              src={state ? state.pic : ""}
              alt="Profile"
            />
          </div>
          <div className="row col s6">
            <h4 className="col s6" style={{ textAlign: "center" }}>
              <strong>{state ? state.name : "loading"}</strong>
            </h4>
            <div className="file-field input-field col s6">
              <div className="btn">
                <span>Edit pic</span>
                <input
                  type="file"
                  onChange={(e) => uploadPic(e.target.files[0])
                  }
                />
              </div>
              <div className="file-path-wrapper" />
              <input className="file-path validate" type="text" />
            </div>
          </div>

          <div
            className="row col s12 offset-s2"
            style={{ fontSize: "1.2rem", fontWeight: "bolder" }}
          >
            <div className="col s3">{mypics.length}posts</div>
            <div className="col s3">
              {state ? state.following.length : 0}following
            </div>
            <div className="col s3">
              {state ? state.follower.length : 0}followers
            </div>
          </div>
        </div>

        <div className="row">
          {mypics.map((item, idx) => {
            return (
              <img
                key={idx}
                className="col s12 m6 l4 material-box"
                src={item.photo}
                alt={item.title}
              />
            );
          })}
        </div>
      </div>
    );
}


export default Profile;