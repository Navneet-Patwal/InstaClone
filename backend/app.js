const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
const {MONGOURL} = require("./config.js/dev.js");
const PORT = 5000;
mongoose.connect(MONGOURL,{useNewUrlParser:true,useUnifiedTopology:true});
mongoose.connection.on('connected', ()=>{
    console.log("yeah connected","on port ",PORT);
})

mongoose.connection.on('error',(err)=>{
    console.log(err);
})


require('./models/user.js');
require('./models/post.js');
app.use(cors())
app.use(express.json())
app.use(require('./routes/auth.js'))
app.use(require('./routes/posts.js'))
app.use(require('./routes/user.js'))


// if(process.env.NODE_ENV === "production"){
//     app.use(express.static('myapp/build'));
//     const path = require('path');
//     app.get("*",(req,res)=>{
//         res.sendFile(path.resolve(__dirname,'client','build','index.html'))
//     })

// }

app.listen(PORT, ()=>{
    console.log("server runnning ");
}) 

