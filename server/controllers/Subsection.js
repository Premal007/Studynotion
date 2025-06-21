const SubSection = require('../models/SubSection');
const Section = require('../models/Section');   
const  { uploadImageToCloudinary } = require('../utils/imageUploader');

// Create Subsection -> Handler function
exports.createSubSection = async (req, res) => {
    try {
        // 1. fetch data from re body
        // 2. extract file/vid
        // 3. validation
        // 4. upload vid to cloudinary
        // 5. create subsection
        // 6. update section with this subsection's ObjectId
        // 7. return response

        // 1.
        const { sectionId , title , timeDuration , description} = req.body;

        // 2.
        const video = req.files.videoFile;

        // 3.
        if (!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required fields",
            });
        }

        // 4.
        const uploadDetails = uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        // 5.
        const subSectionDetails = await SubSection.create({
            title : title,
            timeDuration : timeDuration,
            description : description,
            videoUrl : uploadDetails.secure_url,
        }); 

        // 6.
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { $push: { subsection: subSectionDetails._id } },
            { new: true }
        );

        //TODO
        // HW :- use populate in such a way that it shows the subsection details in the section object instead of just the subsection id

        // 7.
        return res.status(200).json({
            success: true,
            message: "Subsection created successfully",
            updatedSection,
        });

    } catch (error) {
        console.error("Error in createSubSection: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error in subsection controller",
            error: error.message,
        });
    }
};

//HW :- Update subsection -> Handler function

// HW :- Delete subsection -> Handler function