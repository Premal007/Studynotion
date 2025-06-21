const mongoose = require('mongoose');
const { resetPasswordToken } = require('../controllers/ResetPassword');

const profileSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,      //If you add { type: String, trim: true } to a field in your schema, then trying to save strings like "  hello", or "hello ", or "  hello ", would end up being saved as "hello" 
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        enum: ["Admin", "Student" ,"Instructor"],
        required: true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "Profile", //name of the model
    },
    courses:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    image:{
        type: String,
        required: true,
    },
    token:{
        type: String,
    },
    resetPasswordExpires:{
        type: Date,
    },
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress",
        }
    ],  
    
});

module.exports = mongoose.model('Profile', profileSchema);