import React, { useState,useContext } from "react";
import {Link,useNavigate} from "react-router-dom";
import M from 'materialize-css';
import { UserContext } from "../../App";
const SignIn = () => {
    const {dispatch} = useContext(UserContext);
    const [email,setEmail] = useState('');
    const [password,setPass] = useState('');
    const navigate = useNavigate('');
    const  postData = () => {
        //eslint-disable-next-line
        if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))){
            return M.toast({html:"Invalid Email",classes:"#d32f2f red darken-2"});
        }
        fetch('/signin',{
        method:'post',
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
            email:email,
            password:password
        })
    }).then(res=>{return res.json()}).then(data => {
        if(data.error){
            M.toast({html:data.error,classes:"ff1744 red accent-3"});
        }else{
            localStorage.setItem('jwt', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            dispatch({type:"USER",payload:data.user});
            M.toast({html:"Signed In", classes:"#00e676 green accent-3"});
            navigate('/');
        }
    }).catch(err=> console.log(err));
    }

    return (
        <div className="my-card outer-card">
        <div className="card auth-card">
            <h2 style={{fontSize:"4vw",fontFamily:"Grand Hotel"}}>Instagram</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
            <input type="password" placeholder="Password" value={password} onChange={(e)=>setPass(e.target.value)}></input>
            <button className="btn wvaes-effect waves-light" onClick={()=>postData()}>Login</button>
            <h6><Link to="/signup">Don't have an account ?</Link></h6>
        </div>
    </div>
    )
}


export default SignIn;