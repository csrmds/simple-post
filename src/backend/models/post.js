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
    userAccountId: Schema.Types.ObjectId,
}, { timestamps: true }
)

const Post= model('Post', postSchema)
export default Post