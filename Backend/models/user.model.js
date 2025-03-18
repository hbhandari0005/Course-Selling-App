const mongoose=require("mongoose")
const Schema=mongoose.Schema
const passportLocal=require('passport-local-mongoose');
const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    }],
    myCourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course'
    }]
})
userSchema.plugin(passportLocal);
const User=mongoose.model("User",userSchema);
module.exports=User
