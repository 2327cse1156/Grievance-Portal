import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    complaint:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Complaint",
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    text:{
        type:String,
        required:true,
        maxLength:500,
    },
    isInternal:{
        type:Boolean,
        default:false,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
})

commentSchema.index({complaint:1,createdAt:-1});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;