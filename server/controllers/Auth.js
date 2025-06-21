const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mailSender = require('../utils/mailSender');


//sendOTP
exports.sendOTP = async(req, res) => {
    try{
        // 1.fetch email from req body
        const {email} = req.body;
    
        //2. check if user already exists
        const user = await User.findOne({email});
    
        // 3. if user exists, send response
        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message: "User already exists"
            })
        }

        // 4. generate OTP
        var otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets:false, specialChars: false, });
        console.log("OTP is: ", otp);

        // 5. Is the already generated unique ?
        let result = await OTP.findOne({otp:otp});

        while(result){//jya sudhi same otp j hoy tya sudhi new generate karvu
            otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets:false, specialChars: false, });
            console.log("OTP is: ", otp);
            result = await OTP.findOne({otp:otp});
        }

        // 6. save OTP in DB
        const otpPayload = {email,otp};

        const otpBody = await OTP.create(otpPayload);
        console.log("OTP body is: ", otpBody);
        
        // 7. return response
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp,
        })
        
    }
    catch(err){
        console.log("Error occured while sending OTP: ", err);
        
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        })
    }

};



//signup
exports.signup = async(req, res) => {
    // 1. fetch data from req body
    // 2. validate data
    // 3. password match krilo
    // 4. check if user already exists

//THIS ARE THE NEW PART THEN THE PREVIOUS ONE USED IN authentication and authorization
    // 5. find Most Recent OTP stored for the user
    // 6. validate OTP

    // 7. Hash password
    // 8. create entry in DB
    // 9. return response

    try{
        // 1.
        const {email, firstName ,lastName , accountType , confirmPassword, otp , contactNumber} = req.body;
    
        // 2.
        if(!email || !firstName || !lastName || !accountType || !confirmPassword || !otp || !contactNumber){
            return res.status(403).json({
                success: false,
                message: "Please provide all the fields"
            })
        }
    
        // 3.
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match"
            });
        }
    
        // 4.
        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message: "User is already registered",
            });
        }
    
        // 5.
        const recentOtp  = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log("Recent OTP is: ", recentOtp);
        
        // 6.
        if(recentOtp.length === 0){
            // OTP not found
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            });
            return res.status(401).json({
                success: false,
                message: "OTP not found",
            });
        }
        else if(otp !== recentOtp.otp){
            // OTP not matched
            return res.status(400).json({
                success: false,
                message: "OTP not matched",
            });
        }
    
        // 7.
        const hashedPassword = await bcrypt.hash(password , 10);
        console.log("Hashed password is: ", hashedPassword);
    
        // 8.
        //first need to create profile entry in DB to put in  additionalDetails
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });
    
        const user = await User.create({
            email,
            firstName,
            lastName,
            accountType,
            password: hashedPassword,
            accountType,
            contactNumber,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // 9.
        res.status(200).json({
            success: true,
            message: "User registered successfully",
            user,
        })
    }


    catch(err){
        console.log("Error occured while signing up: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        })
    }
}



//Login
exports.login = async(req, res) => {
    // 1. fetch data from req body
    // 2. validate data
    // 3. check if user exists
    // 4. check if password is correct then generate token
    // 5. create cookie
    // 6. return response

    try{
        // 1.
        const {email, password} = req.body;

        // 2.
        if(!email || !password){
            return res.status(403).json({
                success: false,
                message: "Please provide all the fields"
            });
        }

        // 3.
        // const user = await User.findOne({email}).populate("additionalDetails");
        const user = await User.findOne({email});
        if(user){
            return res.status(401).json({
                success: false,
                message: "User not found please signup first",
            });
        }

        // 4.
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if(isPasswordMatched){
            const payload = {
                id: user._id,
                email: user.email,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "2h"});
            user.token = token;
            user.password = undefined; // password revel nthi krvano etle
            
            // 5.
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //3 days
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                message: "User logged in successfully",
                token,
                user,
            })
        }
        else{
            // password not matched
            return res.status(401).json({
                success: false,
                message: "Password in correct",
            });
        }

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: "login failed, Internal server error",
            error: err.message
        })
    }
}

//

//ChnagePassword

    // 1. fetch data from req body
    // 2. getold password , new password and confirmNewPassword
    // 3. validate data
    // 4. cupdate the password in DB 
    // 5. send mail - password changed successfully
    // 6. return response

//GITHUB
// Controller for Changing Password
exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id)

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    )
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      console.log("Email sent successfully:", emailResponse.response)
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      })
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
}