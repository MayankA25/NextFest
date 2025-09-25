import mongoose, { mongo, Schema } from "mongoose";

const collegeSchema = new Schema({
    colegeName: {
        type: String,
        requireD: true
    },
    domain: {
        tyoe: String,
        required: true
    },
    admin: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    students: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }]
})

export const College = mongoose.model("College", collegeSchema);
