import mongoose from "mongoose";
const { Schema, model } = mongoose;


const likeSchema = new Schema({
    from: {type: String, required: true }, //post ou comment
    foreignId: { type: Schema.Types.ObjectId, required: true }, //id do post ou do comentario
    react: String,
    userAccount: Schema.Types.ObjectId,
}, { timestamps: true }
)

const Like= model('Like', likeSchema)
export default Like