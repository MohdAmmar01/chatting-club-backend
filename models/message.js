const mongoose = require("mongoose");

const MessageSchema=new mongoose.Schema({
   members:{
    type:[String],
    required:true
   },
    text:{
        type:String,
        required:true
    },
    sendername:{
        type:String
    }
},
{timestamps:true})
module.exports=mongoose.model('message',MessageSchema);