const mongoose = require("mongoose")


const CourseSchema = new mongoose.Schema({
    name: String,
    shortName: String,
    universityName: String,
    universityShortName: String,
    departmentName: String,
    departmentShortName: String,
})

module.exports = mongoose.model("Course", CourseSchema)
