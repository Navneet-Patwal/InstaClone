const express = require('express');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const router = express.Router();
const Post = mongoose.model('Post');

//create post route
router.post("/createpost",requireLogin,(req, res)=>{
    const {title,body,photo} = req.body;
    if(!title || !body || !photo){
        return res.status(422).json({error : "please enter all the fields."})
    }
    const post = new Post({
        title,
        body,
        photo,
        postedBy : req.user
    })
    post.save().then(result =>{
        res.json({post:result})
    }).catch(err => {
        res.json({error : err})
    })
})




//all posts route 

router.get('/allposts',requireLogin,(req, res)=>{
    Post.find().populate("postedBy", "_id name").populate("comments.postedBy", "_id name")
    .then(posts => {

        return res.json({posts : posts})
    }).catch(err => {
       return res.json({error : err})
    })
})


router.get('/followingposts',requireLogin,(req, res)=>{
    Post.find({postedBy:{$in:req.user.following}}).populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then(posts => {
        res.json({posts : posts})
    }).catch(err => {
        res.json({error : err})
    })
})



router.get('/myposts',requireLogin,(req, res)=>{
    Post.find({postedBy : req.user._id}).populate("postedBy","_id name")
    .then(myposts => {
         res.json({myposts : myposts})
    }).catch(err =>{
        console.log(err);
    })
})

//likes router
router.put('/likes',requireLogin, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{new:true}).then((data)=>{
        if(data.err){
            res.status(400).json({error:data.err})
        }
        else{
            res.status(200).json({result:data})
        }
    })
})

//unlikes router
router.put('/unlikes',requireLogin, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{new:true}).then((data)=>{
        if(data.error){
            res.status(400).json({error:data.err})
        }
        else{
            res.status(200).json({result:data})
        }
    })
})


//comments route

router.put('/comments',requireLogin, (req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{new:true}).populate("comments.postedBy","_id name")
    .then((result,err)=>{
        if(err){
            res.status(400).json({error:err})
        }
        else{
            res.status(200).json({result:result})
        }
    }).catch(err=>{console.log(err)})
    })
       
    
//delete route
router.delete("/deletepost/:postId",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id").then(post=>{
        if(!post){
            return res.status(401).json({error:"Some error occured"});
        }
        if(post.postedBy._id.toString() == req.user._id.toString()){
            post.deleteOne()
            .then(result=>{
                res.json({result})
            }).catch(err=> console.log(err))
        }
    }).catch(err=> console.log(err))
})



module.exports = router;