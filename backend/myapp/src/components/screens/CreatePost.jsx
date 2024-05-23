import React, { useEffect, useState } from "react";
import M from 'materialize-css';
import { useNavigate } from "react-router-dom";

const CreatePost = () =>{

    const[title, setTitle] = useState('');
    const[body, setBody] = useState('');
    const[image, setImage] = useState('');
    const[url, setUrl] = useState('');
    const navigate = useNavigate();

    useEffect(()=>{
        if(url){
            fetch('/createpost',{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem('jwt')
            },
            body :JSON.stringify({
                title:title,
                body:body,
                photo:url
            })
        }).then(res=>res.json()).then(data=>{
            if(data.error){
                M.toast({html : data.error,classes:"#ff1744 red accent-3"});
            }else {
                M.toast({html : " Posted ", classes:"#00e676 green accent-3"})
                navigate('/')
            }
        }).catch(err=>{
            console.log(err)
        });
        }
    },[url,body,title,navigate])

    const postDetails = () => {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'ml_default');
        data.append('cloudname','dwlki730j')

        fetch('https://api.cloudinary.com/v1_1/dwlki730j/image/upload',{
            method:'post',
            body:data
        }).then(res => res.json())
        .then(data => setUrl(data.secure_url))
        .catch(err=> console.log(err));

    }
    

    return (
      <div
        className="card input-field"
        style={{
          margin: "10rem auto",
          textAlign: "center",
          padding: "1rem",
          maxWidth: "25rem",
        }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body"
        />
        <div className="file-field input-field">
          <div className="btn">
            <span>Add Image</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper" />
          <input className="file-path validate" type="text" />
        </div>
        <button className="btn waves-effect waves-light" onClick={()=>postDetails()}>
          Post
        </button>
      </div>
    );
}

export default CreatePost;