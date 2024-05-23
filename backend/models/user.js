const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required : true
    },
    email:{
        type: String,
        required : true
    },

    password:{
        type: String,
        required : true
    },
    pic:{
        type:String,
        default : "https://res.cloudinary.com/dwlki730j/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1694848907/wallpaperflare.com_wallpaper_18_qgsnsr.jpg"
    },
    follower:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId, ref:"User"}],
});

mongoose.model('User',userSchema);