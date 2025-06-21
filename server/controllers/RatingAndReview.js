const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const User = require('../models/User');
const mongoose = require('mongoose');

//createRating -> Handler function
exports.creatRating = async (req, res) => {
    try{
        // 1. get userId
        // 2. fetch data from request body
        // 3. check if user is enrolled in the course
        // 4. check if user has already revied the course
        // 5. create rating and review
        // 6. update course with this rating and review
        // 7. return response

        // 1.
        const userId = req.user.id;

        // 2.
        const { courseId, rating, review } = req.body;

        // 3.
        const courseDetails = await Course.findOne({ _id: courseId }, { studentsEnrolled: { $elemMatch: { $eq: userId } } });
        if (!courseDetails ) {
            return res.status(404).json({
                success: false,
                message: "You are not enrolled in this course",
            });
        }

        // 4.
        const alreadyReviewed = await RatingAndReview.findOne({ user: userId, course: courseId });
        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this course",
            });
        }

        // 5.
        const ratingAndReview = await RatingAndReview.create({
            user: userId,
            course: courseId,
            rating,
            review,
        });

        // 6.
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id : courseId}, 
            {
                $push: { ratingsAndReviews: ratingAndReview._id },
            },
            {new: true});
        console.log("Updated Course Details: ", updatedCourseDetails);
        

        // 7.
        return res.status(201).json({
            success: true,
            message: "Rating and review created successfully",
            data: ratingAndReview,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot create rating and review",
            error: error.message,
        });
    }
}


// getAverageRating -> Handler function
exports.getAverageRating = async (req, res) => {
    try{
        // 1. get courseId
        // 2. calculate average rating
        // 3. return response

        // 1.
        const { courseId } = req.body.courseId ;

        // 2.
        const result = await RatingAndReview.aggregate([
            { $match: { course: new mongoose.Types.ObjectId(courseId) } }, // because courseId pehla string hti tene objectId ma convert karvu pade
            { $group: { _id: null, averageRating: { $avg: "$rating" } } }
        ]);


        // 3.
        // If ratings found, return the average rating
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            });
        }
        // If no ratings found, return 0
        return res.status(200).json({
            success: true,
            message: "No ratings found for this course",
            averageRating: 0,
        });


    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot fetch average rating",
            error: error.message,
        });
    }
}


// getAllRatingsAndReviews -> Handler function

exports.getAllRating = async (req, res) => {
    try{
        const allReviews = await RatingAndReview.find({})
            .sort({rating: -1}) // Sort by rating in descending order
            .populate({
                path: "user",
                select: "firstName lastName email image",// Select only the fields you want from the user
            })
            .populate({
                path: "course",
                select: "courseName", 
            })
            .exec();

        return res.status(200).json({
            success: true,
            data: allReviews,
            message: "All ratings and reviews fetched successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot fetch all ratings and reviews",
            error: error.message,
        });
    }
}