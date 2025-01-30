import mongoose from "mongoose";
const { Schema, model } = mongoose;


const userAccountSchema = new Schema({
    userName: { type: String, required: true },
    password: String,
    email: String,
    firstName: String,
    lastName: String,
    birthDate: Date,
    type: String,
}, { timestamps: true }
)

const UserAccount= model('UserAccount', commentSchema)
export default UserAccount