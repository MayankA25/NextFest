import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tags: [{
        tyoe: String,
        required: true
    }],
    sharedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    sharedTo: [{
        type: String
    }],

    startDate: {
        type: Date,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    tags: [{
        type: String,
        // required: true
    }],
    completed: {
        type: Boolean,
        default: false
    }
});


export const Todo = new mongoose.model("Todo", todoSchema);