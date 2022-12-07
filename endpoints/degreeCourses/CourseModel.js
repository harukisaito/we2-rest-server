const mongoose = require("mongoose")


const CourseSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: String,
    shortName: String,
    universityName: String,
    universityShortName: String,
    departmentName: String,
    departmentShortName: String,
})

module.exports = mongoose.model("Course", CourseSchema)
