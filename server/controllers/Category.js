const Category = require('../models/Category');
const mongoose = require('mongoose');

// Create a new category -> Handler function
exports.createCategory = async (req, res) => {
    try {
        // 1. Get the data from the request body
        const { name, description } = req.body;

        // 2. validation
        if(!name || !description ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all the required fields",
            });
        }

        // 3. create entry of tag into DB
        const tagDetails = await Tag.create({
            name : name,
            description : description,
        });
        console.log(tagDetails);

        // 4. return response
        return res.status(200).json({
            success: true,
            message: "Tag created successfully",
            tagDetails,
        });
        
    }catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error in tags controller",
            error: error.message,
        });
    }
};

// Get all categories -> Handler function
exports.showAllCategories = async (req, res) => {
    try {
        // 1. Get all categories from DB
        const allCategories = await Category.find({} , {name:true , description:true});

        // 2. return response
        return res.status(200).json({
            success: true,
            message: "All categories fetched successfully",
            allCategories,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error in categories controller",
            error: error.message,
        });
    }
};

// categoryPage details 
exports.categoryPageDetails = async (req, res) => {
    try {
        // 1. get category id
        // 2. get courses for specified categoryId
        // 3. validation
        // 4. get courses for different categories
        // 5. get top selling courses
        // 6. return response

        // 1.
        const { categoryId } = req.body;

        // 2.
        const selectedCategory = await Category.findById(categoryId)
                                                    .populate("courses")
                                                    .exec();

        // 3. validation
        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // 4.
        const differentCategories = await Category.find({
            _id: { $ne: categoryId } // Exclude the selected category
        })        // ne -> not equal
        .populate("courses")
        .exec();

        
        // 5. get top selling courses

        // HW :-
        // const topSellingCourses = await Course.find()
        //     .sort({ sales: -1 })
        //     .limit(5)
        //     .exec();

        // 6. return response
        return res.status(200).json({
            success: true,
            message: "Category page details fetched successfully",
            data: {
                selectedCategory,
                differentCategories,
                // topSellingCourses,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot fetch category details",
            error: error.message,
        });
    }
};