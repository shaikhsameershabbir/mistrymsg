import mongoose, { Schema, Document } from 'mongoose'
import { Content } from 'next/font/google'

export interface Massage extends Document {
    content: string;
    createdAt: Date
}

const MassageSchema: Schema<Massage> = new Schema({
    content: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})


export interface User extends Document {
    username: String;
    email: string;
    verifyCode: string;

    verifyCodeExpiry: Date;
    isVerified: boolean,
    isAcceptingMessage: boolean;
    massage: Massage[]
}
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true,
        match: [emailPattern, 'Please use valid email address'],

    },
    verifyCode: {
        type: String,
        required: [true, 'Verify code  is required'],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify code expiry is required'],
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    massage: [MassageSchema]

})


const UserModal = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema))
export default UserModal;