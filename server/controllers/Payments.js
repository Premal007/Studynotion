const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const {courseEnrollmentEmail} = require('../utils/mailTemplates/courseEnrollmentEmail');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { log } = require('console');
const { paymentSuccessEmail } = require('../utils/mailTemplates/paymentSuccessEmail');
const CourseProgress = require('../models/CourseProgress');


// capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {

    // 1. get courseId and userId from request body
    // validation
    // 2. validate corseId 
    // 3. validate courseDetails
    // 4. check if user has already paid for the course
    // 5. order create 
    // 6. return response

    const { course_id } = req.body;
    const userId = req.user.id; // from auth middleware, user id is stored in req.user

    // 2.
    if (!course_id) {
        return res.status(400).json({
            success: false,
            message: "Please provide valid course ID",
        });
    }

    // 3.
    let course;
    try{
        course = await Course.findById(course_id);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course could not find the course with the provided ID",
            });
        }

        // 4.
        // first convert the userId into ObjectId from string
        const uid = new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uid)){
            return res.status(400).json({
                success: false,
                message: "You have already enrolled in this course",
            });
        }
    }
    catch(err){
        return res.status(404).json({
            success: false,
            message: "Course not found",
        });
    }

    // 5.
    const amount = course.price ;
    const currency = "INR"; // Indian Rupee

    const options = {
        amount: amount * 100, // amount in paise
        currency: currency,
        receipt: Math.random(Date.now()).toString(), // unique receipt ID
        notes: {
            courseId: course_id,
            userId: userId // this will be used after the payment is successful to update the course and user details
        }
    };

    try{
        // initiate teh payment using Razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log("Payment Response: ", paymentResponse);
        
        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            courseName: course.courseName,
            coursseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        });
    }
    catch(err){
        console.log("Error while creating Razorpay order: ", err);
        return res.status(500).json({
            success: false,
            message: "Could not initiate order",
            error: err.message
        });
    }

}





//verify signature of the razorpay and server 
exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678";

    const signature = req.headers['x-razorpay-signature'];

    //convert the webhook on the server in the hashed format to compare with the signature
    const shasum = crypto.createHmac('sha256', webhookSecret); // create a sha256 hash using the webhook secret (MAC - Message Authentication Code no use kryo che)
    shasum.update(JSON.stringify(req.body)); // convert the request body to string and update the shasum with it
    const digest = shasum.digest('hex'); // create the digest in hex format

    if(signature === digest){
        log("Signature verified successfully");

        const{courseId, userId} = req.body.payload.payment.entity.notes;

        try{
            //Find the course and enroll the student in it
            const enrolledCourse = await Course.findByIdAndUpdate(
                {_id : courseId },
                { $push: { studentsEnrolled: userId } }, // push the userId into the studentsEnrolled array
                { new: true } // return the updated course
            );
            if(!enrolledCourse){
                return res.status(500).json({
                    success: false,
                    message: "Course not found",
                });
            }
            log("Enrolled Course: ", enrolledCourse);


            //Find the user and update the coursesEnrolled array
            const enrolledStudent = await User.findByIdAndUpdate(
                {_id: userId},
                { $push: { courses: courseId } }, // push the courseId into the coursesEnrolled array
                { new: true } // return the updated user
            );
            if(!enrolledStudent){
                return res.status(500).json({
                    success: false,
                    message: "User not found",
                });
            }
            console.log("Enrolled Student: ", enrolledStudent);
            

            // send email to the user
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Course Enrollment Successful",
                "congratulations! You have successfully enrolled in the course",
            );

            console.log("Email Response: ", emailResponse);

            return res.status(200).json({
                success: true,
                message: "signature verified successfully and user enrolled in the course",
                course: enrolledCourse,
                user: enrolledStudent
            });

        }
        catch(err){
            log("Error while verifying signature: ", err);
            return res.status(500).json({
                success: false,
                message: "Error while verifying signature",
                error: err.message
            });
        }
    }
    else{
        return res.status(400).json({
            success : false,
            message : "invalid request"
        });
    }
}



// GITHUB
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    )
  } catch (error) {
    console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please Provide Course ID and User ID" })
  }

  for (const courseId of courses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnroled: userId } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }
      console.log("Updated course: ", enrolledCourse)

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      })
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled student: ", enrolledStudent)
      // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )

      console.log("Email sent successfully: ", emailResponse.response)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}