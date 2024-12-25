import mongoose from "mongoose";
const { Schema, model } = mongoose;


const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userAccountId: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const Post= model('Post', postSchema)
export default Post