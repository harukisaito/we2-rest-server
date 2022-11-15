const express = require("express")
const router = express.Router()

const courseService = require("./CourseService") 
const authenticationUtils = require("../../utils/AuthenticationUtils")

const isAuthenticated = authenticationUtils.isAuthenticated
const isAdmin = authenticationUtils.isAdmin


//#region get all courses OR get courses from university
const getAllCourses = (req, res) => {
    console.log('\nstart: get all courses')
    
    const isEmpty = (obj) => {
        return Object.keys(obj).length === 0
    }
    
    const searchQuery = req.query
    const uniName = searchQuery.universityShortName

    const getAllCoursesService = (err, courses) => {
        if(err) {
            console.log('finish: get all courses')
            res.status(404).send({error: `error getting users: ${err.message}`})
            return            
        }
        if(!courses) {
            console.log('finish: get all courses')
            res.status(404).send({error: `error getting users: ${err.message}`})
            return            
        }
        
        console.log('finish: get all courses')
        res.send(Object.values(courses))
    }

    // get courses by uni name
    if(!isEmpty(searchQuery)) { 
        courseService.getCoursesByUniName(uniName, getAllCoursesService)
    }
    // get all courses 
    else { 
        courseService.getCourses(getAllCoursesService)
    }
}

router.get("/", isAuthenticated, isAdmin, getAllCourses)
//#endregion get all courses OR get courses from university


//#region get course by id
const getCourseByID = (req, res) => {
    console.log('\nstart: get course by id process')
    const courseID = req.params.courseID

    const getCourseByIDService = (err, course) => {
        if(err) {
            res.send({error: `Error while trying to search for course: ${courseID}`})
            console.log('finish: get course by id process')
            return
        }
        if(!course) {
            res.status(404).send({error: `error getting course: ${err.message}`})
            console.log('finish: get course by id process')
            return
        }
        
        console.log('finish: get course by id process')
        res.send(course)
    }
    
    courseService.getCourseByID(courseID, getCourseByIDService)
}

router.get("/:courseID", isAuthenticated, isAdmin, getCourseByID)
//#endregion get course by id


//#region create course
const createCourse = (req, res) => {
    console.log('\nstart: create course process')
    const courseProps = req.body
    const createCourseService = (err, course) => {
        if(!course) {
            console.log('finish: create course process')
            res.status(400).send({error:`error creating new course: ${err.message}`})
            return
        }

        console.log(`created course: '${course.name}'`)
        console.log('finish: create course process')
        res.status(201).send(course)
    }

    courseService.createCourse(courseProps, createCourseService)
}

router.post("/", isAuthenticated, isAdmin, createCourse)
//#endregion create course


//#region update course by id
const updateCourseByID = (req, res) => {
    console.log('\nstart: update course')

    const courseID = req.params.courseID
    const props = req.body

    const updateCourseService = (err, course) => {
        if(err) {
            console.log('finish: update course')
            res.send({error: `error updating course: ${err.message}`})
            return
        }
        if(!course) {
            console.log('finish: update course')
            res.send({error: `error updating course: ${err.message}`})
            return
        }

        console.log('finish: update course')
        res.status(201).send(course)
    }

    // check if user is admin 
    courseService.updateCourseByID(courseID, props, updateCourseService)
}

router.put("/:courseID", isAuthenticated, isAdmin, updateCourseByID)
//#endregion update course by id


//#region delete course
const deleteCourse = (req, res) => {
    console.log('\nstart: delete course process')
    
    const courseID = req.params.courseID
    const deleteCourseService = (err, course) => {
        if(err) {
            console.log('finish: delete course process')
            res.send({error: `error deleting course: ${err.message}`})
            return
        }
        if(!course) {
            console.log('finish: delete course process')
            res.send({error: `error deleting course: '${courseID}'`})
            return
        }

        console.log('finish: delete course process')
        res.status(201).send(course)
    }

    courseService.deleteCourse(courseID, deleteCourseService)
}

router.delete("/:courseID", isAuthenticated, isAdmin, deleteCourse)
//#endregion delete course


module.exports = router