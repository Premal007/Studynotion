const mongoose = require('mongoose');
const Category = require('./Category');

const courseSchemma = new mongoose.Schema({
    courseName:{
        type: String,
        required: true,
    },
    courseDescription:{
        type: String,
        
    },  
    intructor:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : "User", //name of the model
    },
    whatyouWilllearn:{
        type: String,
    },
    courseContent:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Section",
        }
    ],
    ratingAndReviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingAndReview",
        }
    ],

    price:{
        type:String,
    },
    thumbnail:{
        type: String,
    },
    tag : {
        type: [String],
        required: true,
    },
    category:{
        type: mongoose.mongoose.Schema.Types.ObjectId,
        ref: "Tag",
    },

    studentsEnrolled:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }]
});

module.exports = mongoose.model("Course", courseSchemma);