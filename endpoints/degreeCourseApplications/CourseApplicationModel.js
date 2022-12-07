const mongoose = require("mongoose")


const CourseApplicationSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    applicantUserID: String,
    degreeCourseID: String,
    targetPeriodYear: String,
    targetPeriodShortName: String
})

module.exports = mongoose.model("CourseApplication", CourseApplicationSchema)
