import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    college: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'College'
    },
    password: {
        type: String,
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profilePic: {
        type: String,
        // required: true
    },
    regNo: {
        type: String
    },
    phone: {
        type: String,
        // required: true
    },
    role: {
        type: String,
        enum: ["superAdmin", "collegeAdmin", "clubAdmin", "student"],
        default: "student"
    },
    initialFormSubmitted: {
        type: Boolean,
        default: false
    },
    isPublicDomain: {
        type: Boolean,
        default: true
    },
    interests: [{
        type: String,
        required: true
    }],
    accountLinkedToGoogle: {
        type: Boolean,
        default: false
    },
    googleDetails: {
        // accessToken: String,
        refreshToken: String,
        email: String,
        profilePic: String,
        linkedAt: { 
            type: Date
         }
    },
    resume: {
        type: String,
        default: ""
    }
}, {timestamps: true});

export const User = mongoose.model("User", userSchema);
