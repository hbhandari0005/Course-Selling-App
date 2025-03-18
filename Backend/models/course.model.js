const mongoose=require("mongoose")
const courseSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"https://techhubsolutions.in/wp-content/uploads/2022/08/1.jpg"
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
})

const Course=mongoose.model("Course",courseSchema);
module.exports=Course