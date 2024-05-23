import React, { useEffect, useState } from "react";
import {Link,useNavigate}from "react-router-dom"; 
import M from "materialize-css";
const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [image, setImage] = useState("");
    const [url, setUrl] = useState(undefined);
    const navigate = useNavigate();

    useEffect(()=>{
      if(url){
          uploadFields();
      }
      //eslint-disable-next-line
     },[url])



    const uploadPic = () =>{
            const data = new FormData();
            data.append('file', image);
            data.append('upload_preset', 'ml_default');
            data.append('cloudname','dwlki730j')
    
            fetch('https://api.cloudinary.com/v1_1/dwlki730j/image/upload',{
                method:'post',
                body:data
            }).then(res =>{ return res.json()})
            .then(data => setUrl(data.secure_url))
            .catch(err=> console.log(err));
}

const uploadFields = () => {
     //eslint-disable-next-line
     if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))){
        return M.toast({html:"Invalid Email",classes:"#d32f2f red darken-2"});
    }
    fetch('/signup',{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body :JSON.stringify({
            name:name,
            password:password,
            email:email,
            pic:url
        })
    }).then(res=>{ return res.json()}).then(data=>{
        if(data.error){
            M.toast({html : data.error,classes:"#ff1744 red accent-3"});
        }else {
            M.toast({html : data.message, classes:"#00e676 green accent-3"})
            navigate("/signin");
        }
    }).catch(err=>{
        console.log(err)
    });

}







    const postData = () =>{
        if(image){
            uploadPic();
        }else {
            uploadFields();
        }
    }

    return (
      <div className="my-card outer-card">
        <div className="card auth-card">
          <div style={{ fontSize: "4vw", fontFamily: "Grand Hotel" }}>
            Instagram
          </div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></input>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPass(e.target.value)}
          ></input>
          <div className="file-field input-field">
            <div className="btn">
              <span>Upload Profile Picture</span>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper" />
            <input className="file-path validate" type="text" />
          </div>
          <button className="btn wvaes-effect waves-light" onClick={()=>postData()}>
            SignUp
          </button>
          <h6>
            <Link to="/signin">Already have an account ?</Link>
          </h6>
        </div>
      </div>
    );
}


export default SignUp;