const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

//auth
exports.auth = async (req, res, next) => {
    try{
        // 1. Extract token
        const token = req.body.token || req.query.token || req.header("Authorization").replace("Bearer ", "");

        // 2. If token is missing then return response
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }

        // 3. Verify token
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded token: ", decoded);
            req.user = decoded;  // this is done because we need to access the user data in the next middleware (ex. role is used in isStudent)
        }
        catch(err){
            return res.status(401).json({
                success: false,
                message: "Invalid token",
                error: err.message
            })
        }
        next();
    }
    catch(err){
        return res.status(401).json({
            success: false,
            message: "something went wrong while validating the token in authentication",
            error: err.message
        })
    }
}


//isStudent
exports.isStudent = async (req, res, next) => {
    //Using decoded (payload) passed into req.user in auth middleware
    try{
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "this is a protected route for student only"
            })
        }
        next();
    }

    catch(err){
        return res.status(403).json({
            success: false,
            message: "something went wrong while validating the token in isStudent autherization",
            error: err.message
        })
    }
}


//isInstructor
exports.isInstructor = async (req, res, next) => {
    //Using decoded (payload) passed into req.user in auth middleware
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "this is a protected route for instructor only"
            })
        }
        next();
    }

    catch(err){
        return res.status(403).json({
            success: false,
            message: "something went wrong while validating the token in isInstructor autherization",
            error: err.message
        })
    }
}


//isAdmin
exports.isAdmin = async (req, res, next) => {
    //Using decoded (payload) passed into req.user in auth middleware
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "this is a protected route for admin only"
            })
        }
        next();
    }

    catch(err){
        return res.status(403).json({
            success: false,
            message: "something went wrong while validating the token in isAdmin autherization",
            error: err.message
        })
    }
}