const Profile = require('../models/Profile');
const User = require('../models/User');
const mongoose = require('mongoose');
const CourseProgress = require('../models/CourseProgress');
const Course = require('../models/Course');
const {uploadImageToCloudinary } = require('../utils/imageUploader');
const { convertSecondsToDuration } = require('../utils/secToDuration');

exports.updateProfile = async (req, res) => {
    try {
        // 1. fetch data
        // 2. get userId from req.user
        // 3. validate data
        // 4. find profile
        // 5. update profile
        // 6. return response

        // 1.
        const { dateOfBirth="", about="", contactNumber , gender } = req.body;   // default values are set to empty string (jo value user e pass na kri hoy to)

        // 2.
        const id = req.user.id;  // Auth ma login ma payload ma _id save kreli che e ahiya use thse

        // 3.
        if (!gender || !id || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required fields",
            });
        }

        // 4.
        //first we will find userDetails
        const userDetails = await User.findOne(id);

        //from userDetils we will get profileId
        const profileId = userDetails.additionalDetails;

        //then we will find profile using profileId
        const profileDetails = await Profile.findById(profileId);

        // 5.
        // ahiya DB ma navo object nahi banavvo pade, because we are updating the existing profile details
        //here the object is already created so ww will just update the fields by using save method and we will not create a new object
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;   
        profileDetails.contactNumber = contactNumber;   
        profileDetails.gender = gender;
        await profileDetails.save();

        // 6.
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error in profile controller",
            error: error.message,
        });
    }   
}

// delete profile -> Handler function

exports.deleteAccount = async (req, res) => {
    try{
        // 1. get Id from req.user
        // 2. validate Id
        // 3. delete profile
        // 4. delete User
        // 5. return response

        // 1.
        const id = req.user.id;  // Auth ma login ma payload ma _id save kreli che e ahiya use thse

        // 2.
        const userDetails = await User.findById(id);

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // TODO: //HW : unenroll user from all enrolled courses

        // 3.
        // await Profile.findByIdAndDelete(userDetails.additionalDetails);
        await Profile.findByIdAndDelete( {_id :userDetails.additionalDetails} );

        // 4.
        await User.findByIdAndDelete({_id : id });

        // 5.
        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error in profile controller",
            error: error.message,
        });
    }
}

// get all the UserDetails -> Handler function
exports.getAllUserDetails = async (req, res) => {
    try {
        // 1. get userId from req.user
        // 2. validation and  find user details
        // 3. return response

        // 1.
        const id = req.user.id;  // Auth ma login ma payload ma _id save kreli che e ahiya use thse

        // 2.
        const userDetails = await User.findById(id).populate("additionalDetails").exec() ;

        // 3.
        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            userDetails,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error in profile controller",
            error: error.message,
        });
    }
}