const express = require('express');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const router = express.Router();
const Post = mongoose.model('Post');
const User = mongoose.model('User');

router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id}).select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .then(posts=>{
            res.json({user,posts:[posts]})
        }).catch(err=>{
            res.status(401).json({error:err})
        })
    }).catch(err=>{
        res.json({error:err})
    })
})


router.put('/follow',requireLogin, (req, res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers :req.user._id}
    },{new :true}).then((result,err)=>{
        if(err){
            return res.status(402).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{new :true}).select("-password").then(result=>{
            return res.json(result);
        }).catch(err=>{
            return res.status(422).json({error:err});
        });
        
    });
})





router.put('/unfollow',requireLogin, (req, res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers :req.user._id}
    },{new :true}).then((result,err)=>{
        if(err){
            return res.status(402).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{new :true}).select("-password").then(result=>{
            return res.json(result);
        }).catch(err=>{
            return res.status(422).json({error:err});
        });
        
    });
})
    
router.put('/updatepic',requireLogin,(req, res)=>{

    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}}).then((result,err)=>{
        if(err){
            return res.status(402).json({error:"Pic doesn't get updated..."});
        }
        return res.json(result);
    })
})



module.exports = router;