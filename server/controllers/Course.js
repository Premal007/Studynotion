const Course = require('../models/Course');
const Tag = require('../models/Category');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const Category = require('../models/Category');
const Section = require('../models/Section');
const subSection = require('../models/SubSection');

//createCourse -> Handler function
exports.createCourse = async (req, res) => {
    try{
        // 1. fetch data from request body
        const { courseName , courseDescription , whatYouWillLearn , price , tag } = req.body;

        //2. get thumbnail (cloudinary vadi file fetch karva)
        const thumbnail = req.files.thumbnailImage;

        // 3. validate data
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            return res.status(400).json({
                success: false,
                message: "Please provide all the required fields",
            });
        }

        // 4. check for instructor to add it in course details
        const userId = req.user.id;  // Auth ma login ma payload ma _id save kreli che e ahiya use thse

        const instructorDetails = await User.findById(userId);
        console.log("Instructor details: ", instructorDetails);

        // TODO :- Verify that userId and instructorDetails._id are same or different ?

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructor not found",
            });
        }

        // 5. check if the tag is valid or not
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success: false,
                message: "Tag not found",
            });
        }

        // 6. upload thumbnail(image) to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, FOLDER_NAME);

        // 7. create course entry in DB
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag : tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
            instructorId: instructorDetails._id,
        });


        // 8. add new course to instructor's courses array
        await User.findByIdAndUpdate(
            instructorDetails._id,
            { $push: { courses: newCourse._id } }, // add course id to instructor's courses array
            { new: true }
        );
        
        // 9. update tag's courses array




        // 10. return response
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data : newCourse,
        });
    }
    catch (error) {
        console.error("Error in createCourse: ", error);
        
        return res.status(500).json({
            success: false,
            message: "Internal server error in course controller",
            error: error.message,
        });
    }
}


// getAllCourses -> Handler function

exports.getAllCourses = async (req, res) => {
    try {
        // 1. Get all courses from DB

        // const allCourses = await Course.find({},
        //                                     {
        //                                     courseName:true , 
        //                                     instructor:true , 
        //                                     ratingAndReviews:true , 
        //                                     price:true , 
        //                                     studentsEnrolled:true , 
        //                                     thumbnail:true
        //                                 }).populate("instructor")
        //                                 .exec();
        
        const allCourses = await Course.find({});

        // 2. return response
        return res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            data : allCourses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot fetch all courses",
            error: error.message,
        });
    }
}


//getCourseDetails
exports.getCourseDetails = async (req,res) => {
    try{
        // 1. get id
        const{courseId} = req.body;

        // 2. find course details
        const courseDetails = await Course.find(
                                        {_id : courseId})
                                        .populate(
                                            {
                                                path:"instructor",
                                                populate:{
                                                    path:"additionalDetails"
                                                } // means populate the additionalDetails field of instructor too
                                            }
                                        )
                                        .populate("category")
                                        .populate("ratingAndReviews")
                                        .populate({
                                            path: "courseContent",
                                            populate: {
                                                path: "subSections",
                                            } // means populate the subSections field of each courseContent too
                                        })
                                        .exec();
        // 3. validate course details
        if(!courseDetails  === 0){
            return res.status(400).json({
                success: false,
                message: `Course not found with ${courseId}`,
            });
        }
        // 4. return response
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails,
        });
    }
    catch(err){
        console.error("Error in getCourseDetails: ", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error in getCourseDetails",
            error: err.message,
        });
    }
}


// GITHUB
// Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// GITHUB
// Get One Single Course Details
// exports.getCourseDetails = async (req, res) => {
//   try {
//     const { courseId } = req.body
//     const courseDetails = await Course.findOne({
//       _id: courseId,
//     })
//       .populate({
//         path: "instructor",
//         populate: {
//           path: "additionalDetails",
//         },
//       })
//       .populate("category")
//       .populate("ratingAndReviews")
//       .populate({
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       })
//       .exec()
//     // console.log(
//     //   "###################################### course details : ",
//     //   courseDetails,
//     //   courseId
//     // );
//     if (!courseDetails || !courseDetails.length) {
//       return res.status(400).json({
//         success: false,
//         message: `Could not find course with id: ${courseId}`,
//       })
//     }

//     if (courseDetails.status === "Draft") {
//       return res.status(403).json({
//         success: false,
//         message: `Accessing a draft course is forbidden`,
//       })
//     }

//     return res.status(200).json({
//       success: true,
//       data: courseDetails,
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }

// GITHUB
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


// GITHUB
// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

// GITHUB
// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnroled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}