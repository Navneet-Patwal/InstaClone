const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config.js/keys.js') ;

//SignUp Route

router.post('/signup', (req, res) => {
    const {name, email, password,pic} = req.body;
    if(!email || !name || !password) {
       return  res.status(401).json({error : 'please add all the fields'});
    }
    User.findOne({email:email}).then(savedUser=>{
        if (savedUser) {
           return res.status(422).json({error:'User already exists with that email'});
        }

        bcrypt.hash(password,14).then(hashedPassword => {

            const user = new User({
                email:email,
                password:hashedPassword,
                name:name,
                pic:pic,
            });
            user.save()
            .then(user=>{
                res.status(200).json({message : 'Saved sucessfully'})
            })
            .catch(err => {
                res.status(400).json({error:err})
            })

        })  
    }).catch(err => {
        console.log(err);
    })
    
})

//SignIn route

router.post('/signin', (req, res) => {
    const {email, password} = req.body;
    if (!email || !password){
        return res.status(301).json({error:'Please fill all the fields'})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if (!savedUser){
            return res.status(422).json({error : "Invalid User"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch){
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET);
                const {_id, name, email, follower, following,pic} = savedUser;
                res.status(200).json({token:token,user:{_id,name,email, follower, following,pic}})
            }else {
                res.status(433).json({error : "Invalid User"})            }
        })
    }).catch(err => {
        console.log(err);
    })
    
})

module.exports = router;