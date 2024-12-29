import mongoose from "mongoose";
const { Schema, model } = mongoose;


const postImageSchema = new Schema({
    postId: String,
    address: String,
    description: String,
    type: String,
    size: Number,
    width: Number,
    height: Number,
    order: Number,
}, { timestamps: true }
)


const PostImage= model('PostImage', postImageSchema)
export default PostImage