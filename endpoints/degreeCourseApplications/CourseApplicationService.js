const Application = require("./CourseApplicationModel")
const courseService = require("../degreeCourses/CourseService")
const userService = require("../user/UserService")


// #region get course applications
const getApplications = (callback) => {
    const findApplications = (err, courseApplications) => {
        if(err) {
            console.log(`error trying to find applications in db \n${err.message}`)
            return callback(err, null)
        }
        
        console.log("returning list of applications in db")
        return callback(null, courseApplications)
    }
    
    Application.find(findApplications)
}
// #endregion get course applications


// #region get applications by course
const getApplicationsByCourse = (courseID, callback) => {
    const filter = {degreeCourseID: courseID}

    const findApplications = (err, applications) => {
        if(err) {
            console.log(`error trying to find applications of ${courseID} in db \n${err.message}`)
            return callback(err, null)
        }
        
        console.log(`returning list of applications of ${courseID} in db`)
        return callback(null, applications)
    }
    
    Application.find(filter, findApplications)
}
// #endregion get by uni name


// #region get applications by user id
const getApplicationsByUserID = (userID, callback) => {
    const filter = {applicantUserID: userID}

    const findApplications = (err, applications) => {
        if(err) {
            console.log(`error trying to find applications of ${userID} in db \n${err.message}`)
            return callback(err, null)
        }
        
        console.log(`returning list of applications of ${userID} in db`)
        return callback(null, applications)
    }
    
    Application.find(filter, findApplications)
}
// #endregion get applications by user id


// #region get application from user
const getApplicationsFromUser = (userID, callback) => {
    if(!userID) {
        return callback({message: "user id is missing"})
    }

    const userObj = {applicantUserID: userID}
    const findApplication = (err, applications) => {
        if(err) {
            console.log(`error while searching for applications from '${userID}' \n${err}`)
            return callback(err, null)
        }
        if(!applications) {
            const msg = `could not find applications from: '${userID}'`
            console.log(msg);
            return callback({message: msg}, null)
        }

        console.log(`found applications from: '${userID}'`)
        callback(null, applications)
    }

    Application.find(userObj, findApplication)
}
// #endregion get application from user


// #region get application by id
const getApplicationByID = (applicationID, callback) => {
    if(!applicationID) {
        return callback({message: "application id is missing"})
    }

    const applicationObj = {id: applicationID}
    const findApplication = (err, application) => {
        if(err) {
            console.log(`error while searching for application '${applicationID}' \n${err}`)
            return callback(err, null)
        }
        if(!application) {
            const msg = `could not find application: '${applicationID}'`
            console.log(msg);
            return callback({message: msg}, null)
        }

        console.log(`found application: '${applicationID}'`)
        callback(null, application)
    }

    Application.findOne(applicationObj, findApplication)
}
// #endregion get application by id


// #region create application
const createApplication = (userIDCreating, applicantUserID, props, callback) => {

    const courseID = props.degreeCourseID
    const year = props.targetPeriodYear
    const targetPeriodShortName = props.targetPeriodShortName

    const saveApplication = (err, application) => {
        if(err) {
            console.log(`error while saving application for: '${userIDCreating}' \n${err.message}`)
            return callback(err, null)
        }

        console.log(`saved application for: '${userIDCreating}'`)
        return callback(null, application)
    }

    const createApplicationService = () => {
        if(applicantUserID == undefined) {
            // user is trying to create application for himself
            applicantUserID = userIDCreating
        }

        const application = new Application({
            applicantUserID: applicantUserID,
            degreeCourseID: courseID,
            targetPeriodYear: year,
            targetPeriodShortName: targetPeriodShortName
        })

        application.save(saveApplication)
    }

    const checkIfCourseExists = (err, degree) => {
        if(err) {
            console.log(`error while checking if degree exists for: '${courseID}' \n${err.message}`)
            return callback(err, null)
        }
        if(!degree) {
            const msg = `degree does not exist`
            console.log(msg)
            return callback({message: msg}, null)
        }

        console.log('creating application')
        createApplicationService()
    }

    const checkIfApplicationExists = (err, application) => {
        if(err) {
            console.log(`error while checking if application exists for: '${userIDCreating}' \n${err.message}`)
            return callback(err, null)
        }
        if(application) {
            const msg = `application already exists`
            console.log(msg)
            return callback({message: msg}, null)
        }

        console.log('checking if course exists')
        courseService.getCourseByID(courseID, checkIfCourseExists)
    }

    const checkForRights = (err, user) => {
        if(err) {
            console.log(`error while creating application for user: '${applicantUserID}' \n${err}`)
            return callback(err, null)
        }
        if(!user) {
            const msg = `could not find user: '${applicantUserID}'`
            console.log(msg);
            return callback({message: msg}, null)
        }
        if(!user.isAdministrator && applicantUserID !== undefined) {
            const msg = 'user is not allowed to create an application for another user'
            console.log(msg)
            return callback({message: msg}, null)
        }

        console.log('got through the rights check')

        const applicationObj = {
            applicantUserID: applicantUserID,
            degreeCourseID: courseID,
            targetPeriodYear: year,
            targetPeriodShortName: targetPeriodShortName
        }

        Application.findOne(applicationObj, checkIfApplicationExists)

        // createApplicationService()
    }

    // check for rights first
    userService.getUserByID(userIDCreating, userIDCreating, checkForRights)
}
// #endregion create application


// #region create application
// const createApplication = (userIDCreating, props, callback) => {
//     const applicantUserID = props.applicantUserID
//     const courseID = props.degreeCourseID
//     const year = props.targetPeriodYear
//     const targetPeriodShortName = props.targetPeriodShortName

//     const saveApplication = (err, application) => {
//         if(err) {
//             console.log(`error while saving application for: '${userIDCreating}' \n${err.message}`)
//             return callback(err, null)
//         }

//         console.log(`saved application for: '${userIDCreating}'`)
//         return callback(null, application)
//     }

//     const createApplicationService = () => {
//         const application = new Application({
//             applicantUserID: applicantUserID,
//             degreeCourseID: courseID,
//             targetPeriodYear: year,
//             targetPeriodShortName: targetPeriodShortName
//         })

//         application.save(saveApplication)
//     }

//     createApplicationService()
// }   
// #endregion create application


// #region update course application
const updateApplicationByID = (applicationID, props, callback) => {
    const courseObj = {_id: applicationID}
    const saveApplication = (err, application) => {
        if(err) {
            console.log(`error updating application: '${applicationID}' \n${err}`)
            return callback(err, null)
        }
        if(!application) {
            let msg = `could not save application: '${applicationID}' while updating`
            console.log(msg)
            return callback({message: msg}, null)
        }

        console.log(`updated application '${applicationID}'`)
        return callback(null, application)
    } 

    const updateAndSafeApplication = (application) => {
        Object.assign(application, props)
        application.save(saveApplication)
    }

    const findAndUpdateApplication = (err, application) => {
        if(err) {
            console.log(err)
            return callback(err, null)
        }
        if(!application) {
            let msg = `application: '${applicationID}' does not exist`
            console.log(msg)
            return callback({message: msg}, null)
        }

        updateAndSafeApplication(application)
    }

    Application.findOne(courseObj, findAndUpdateApplication)
} 
// #endregion update course application


// #region delete course 
const deleteApplication = (applicationID, callback) => {
    const applicationObj = {_id: applicationID}
    const findAndRemoveApplication = (err, application) => {
        if(err) {
            console.log(`error deleting application: '${applicationID}' \n${err}`)
            return callback(err, null)
        }

        if(!application) {
            let msg = `could not find application: '${applicationID}'`
            console.log(msg)
            return callback({message: msg}, null)
        }
        
        console.log(`deleted application: '${applicationID}'`)
        return callback(null, application)
    }

    Application.findOneAndRemove(applicationObj, findAndRemoveApplication)
}
// #endregion delete course


module.exports = {
    getApplications,
    getApplicationsByCourse,
    getApplicationsByUserID,
    getApplicationsFromUser,
    getApplicationByID,
    createApplication,
    updateApplicationByID,
    deleteApplication
}