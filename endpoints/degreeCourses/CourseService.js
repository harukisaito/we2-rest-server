const Course = require("./CourseModel")


// #region get courses
const getCourses = (callback) => {
    const findCourses = (err, courses) => {
        if(err) {
            console.log(`error trying to find courses in db \n${err.message}`)
            return callback(err, null)
        }
        
        console.log("returning list of courses in db")
        return callback(null, courses)
    }
    
    Course.find(findCourses)
}
// #endregion get courses


// #region get courses by uni name
const getCoursesByUniName = (uniName, callback) => {
    const filter = {universityShortName: uniName}

    const findCourses = (err, courses) => {
        if(err) {
            console.log(`error trying to find courses of ${uniName} in db \n${err.message}`)
            return callback(err, null)
        }
        
        console.log(`returning list of courses of ${uniName} in db`)
        return callback(null, courses)
    }
    
    Course.find(filter, findCourses)
}
// #endregion get courses by uni name


// #region get course by id
const getCourseByID = (courseID, callback) => {
    if(!courseID) {
        return callback({message: "user id is missing"})
    }

    const courseObj = {id: courseID}
    const findCourse = (err, course) => {
        if(err) {
            console.log(`error while searching for course '${courseID}' \n${err}`)
            return callback(err, null)
        }
        if(!course) {
            const msg = `could not find course: '${courseID}'`
            console.log(msg);
            return callback({message: msg}, null)
        }

        console.log(`found course: '${courseID}'`)
        callback(null, course)
    }

    Course.findOne(courseObj, findCourse)
}
// #endregion get course by id


// #region create course
const createCourse = (courseID, props, callback) => {
    const courseObj = {id: courseID}
    const name = props.name
    const shortName = props.shortName
    const departmentName = props.departmentName
    const departmentShortName = props.departmentShortName
    const universityName = props.universityName
    const universityShortName = props.universityShortName

    if(courseID == null) {
        return callback({message: 'course ID is missing'}, null)
    }

    const saveCourse = (err, course) => {
        if(err) {
            console.log(`error while saving course: '${name}' \n${err.message}`)
            return callback(err, null)
        }

        console.log(`saved course: '${name}'`)
        return callback(null, course)
    }

    const createCourseService = () => {
        const course = new Course({
            id: courseID,
            name: name,
            shortName: shortName,
            departmentName: departmentName,
            departmentShortName: departmentShortName,
            universityName: universityName,
            universityShortName: universityShortName
        })

        course.save(saveCourse)
    }

    const findCourse = (err, course) => {
        if(err) {
            return callback(err, null)
        }
        if(course) { // already exists
            let msg = `course '${name}' already exists`
            console.log(msg)
            return callback({message: msg}, null)
        }
        
        createCourseService()
    }

    Course.findOne(courseObj, findCourse)
}   
// #endregion create course


// #region update course
const updateCourseByID = (courseID, props, callback) => {
    const courseObj = {id: courseID}
    const saveCourse = (err, course) => {
        if(err) {
            console.log(`error updating course: '${courseID}' \n${err}`)
            return callback(err, null)
        }
        if(!course) {
            let msg = `could not save course: '${courseID}' while updating`
            console.log(msg)
            return callback({message: msg}, null)
        }

        console.log(`updated course '${courseID}'`)
        return callback(null, course)
    } 

    const updateAndSafeCourse = (course) => {
        Object.assign(course, props)
        course.save(saveCourse)
    }

    const findAndUpdateCourse = (err, course) => {
        if(err) {
            console.log(err)
            return callback(err, null)
        }
        if(!course) {
            let msg = `course: '${courseID}' does not exist`
            console.log(msg)
            return callback({message: msg}, null)
        }

        updateAndSafeCourse(course)
    }

    Course.findOne(courseObj, findAndUpdateCourse)
} 
// #endregion update course


// #region delete course 
const deleteCourse = (courseID, callback) => 
{
    const courseObj = {id: courseID}
    const findAndRemoveCourse = (err, course) => {
        if(err) {
            console.log(`error deleting course: '${courseID}' \n${err}`)
            return callback(err, null)
        }

        if(!course) {
            let msg = `could not find course: '${courseID}'`
            console.log(msg)
            return callback({message: msg}, null)
        }
        
        console.log(`deleted course: '${courseID}'`)
        return callback(null, course)
    }

    Course.findOneAndRemove(courseObj, findAndRemoveCourse)
}
// #endregion delete course


module.exports = {
    getCourses,
    getCoursesByUniName,
    getCourseByID,
    createCourse,
    updateCourseByID,
    deleteCourse
}