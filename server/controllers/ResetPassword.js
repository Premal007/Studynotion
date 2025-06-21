//forgot password mate
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const crypto = require('crypto');   


//resetPasswordToken - sending the mail
exports.resetPasswordToken = async (req, res) => {
    // 1. Get email from request body
    // 2. Check if user exists, email validation
    // 3. generate token 
    // 4. update the user by adding token and expiration time
    // 5. create url
    // 6. send mail containing the url
    // 7. return response
    try{

        // 1.
        const { email } = req.body;
    
        // 2.
        const user = await User.findOne({ email : email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
    
        // 3.
        const token = crypto.randomUUID();
    
        // 4.
        const updatedDetails = await User.findOneAndUpdate({email: email}, {
            token: token,
            resetPasswordExpires: Date.now() + 5*60*1000, // 5 min
        }, {
            new: true, // anathi je updated details hse te return thse old vadu nai thay
            runValidators: true,
        });
        
        // 5.
        const url = `http://localhost:3000/update-password/${token}`; 
    
        // 6.
        await mailSender(
            email,
            "Reset Password link",
            `Click on the link to reset your password: ${url}`,
        );
    
        // 7.
        return res.status(200).json({
            success: true,
            message: `Email sent to ${email} with reset password link`,
        });
    }

    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong in reset password mail sending",
            error: error.message,
        });
    }
}


//resetPassword

exports.resetPassword = async (req, res) => {
    // 1. fetch data from req body
    // 2. validation
    // 3. get userdetails from DB using token 
    // 4. if no entry found - invalid token
    // 5. check if token is expired
    // 6. hash password
    // 7. update password
    // 8. return response

    try{
        // 1.
        const { token, password, confirmPassword } = req.body;
        // Q - ahiya token req ni body mathi kai rite ayo ?... e req ma to hto nai to !!
        // Ans - frontend ma je link aapyu htu(upar na handler ma url che e) e link ma frontend thi token pass thyo hse etle avyo re ni body ma

    
        // 2.
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match",
            });
        }

        // 3.
        const userdetails = await User.findOne({ token: token });

        // 4.
        if (!userdetails) {
            return res.status(400).json({
                success: false,
                message: "Invalid token",
            });
        }

        // 5.
        if(userdetails.resetPasswordExpires < Date.now()){
            return res.status(400).json({
                success: false,
                message: "Token expired , please regenerate the token",
            });
        }

        // 6.
        const hashedPassword = await bcrypt.hash(password, 10);

        // 7.
        await User.findOneAndUpdate(
            { token: token }, 
            { password: hashedPassword}, 
            { new: true }
        );

        // 8.
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    }

    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong in reset password",
            error: error.message,
        });
    }
}