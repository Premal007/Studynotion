const User = require("../models/User")

exports.getAllStudents = async (req, res) => {
    try {
        const allStudentsDetails = await User.find({
            accountType: 'Student'
        })
            .populate('additionalDetails')
            .populate('courses')
            .sort({ createdAt: -1 });


        const studentsCount = await User.countDocuments({
            accountType: 'Student'
        });


        res.status(200).json(
            {
                allStudentsDetails,
                studentsCount,
                message: 'All Students Data fetched successfully'
            },
        )
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error while fetching all students',
            error: error.message
        })
    }
}




// ================ get All Instructors ================
exports.getAllInstructors = async (req, res) => {
    try {
        const allInstructorsDetails = await User.find({
            accountType: 'Instructor'
        })
            .populate('additionalDetails')
            .populate('courses')
            .sort({ createdAt: -1 });


        const instructorsCount = await User.countDocuments({
            accountType: 'Instructor'
        });


        res.status(200).json(
            {
                allInstructorsDetails,
                instructorsCount,
                message: 'All Instructors Data fetched successfully'
            }
        )
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Error while fetching all Instructors',
            error: error.message
        })
    }
}