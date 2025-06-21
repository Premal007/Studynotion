const Section = require('../models/Section');
const Course = require('../models/Course');

// Create a new section -> Handler function

exports.createSection = async (req, res) => {
    try{
        // 1. fetch data
        // 2. validation
        // 3. create section
        // 4. update course with section's ObjecctId
        // 5. return response

        // 1.
        const { sectionName, courseId } = req.body;

        // 2.   
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required fields",
            });
        }

        // 3.
        const newSection = await Section.create({sectionName});

        // 4.
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,
                                                    { $push: { courseContent: newSection._id } },
                                                    { new: true }
        );

        //TODO
        //HW :- use populate in such a way that it show the section details in the course object insead of just the section id

        // 5.
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            sectionDetails: newSection,
            updatedCourseDetails: updatedCourseDetails,
        });
    }
    catch (error) {
        console.error("Error in createSection: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error in section controller",
            error: error.message,
        });
    }
}

// Update section -> Handler function

exports.updateSection = async (req, res) => {
    try{
        // 1. data input
        // 2. validation
        // 3. update data
        // 4. return response

        // 1.
        const { sectionId, sectionName } = req.body;
                            // new name avyu hse te sectionName
        // 2.
        if (!sectionId || !sectionName) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required fields",
            });
        }

        // 3.
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName: sectionName },
            { new: true }
        );

        // 4.
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error in section controller",
            error: error.message,
        });
    }   
}

// Delete section -> Handler function
exports.deleteSection = async (req, res) => {
    try{
        // 1. get ID - assuming that we are sending ID in the parameters
        // 2. findByIdAndDelete
        // 3. return response

        // 1.
        const { sectionId } = req.params;

        // 2.
        await Section.findByIdAndDelete(sectionId);

        //TODO: Do wed need to remove the section ID from the course's courseContent array?

        // 3.
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });
        
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error in section controller",
            error: error.message,
        });
    }
}