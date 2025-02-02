const mongoose= require('mongoose')
const { Schema, model } = mongoose;


const commentSchema = new Schema({
    postId: { type: Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
    type: {type: String, default: "comment"},
    responseId: Schema.Types.ObjectId,
}, { timestamps: true }
)

const Comment= model('Comment', commentSchema)
module.exports= Comment