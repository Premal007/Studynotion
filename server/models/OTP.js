const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const OTPschema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    otp: {

        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5*60, // OTP expires in 5 minutes
    },
});


//Pre middleware to send the otp on the email
async function sendverificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verificcation Emmail from StudyNotion",otp);
        console.log("mail sent successfully : ",mailResponse);
        
    }
    catch(err){
        console.log("error occured while sending otp mail : ",err);
        throw err;
    }
}

OTPschema.pre("save",async function (next){
    await sendverificationEmail(this.email , this.otp);
    next();
})

module.exports = mongoose.model('OTP', OTPschema);