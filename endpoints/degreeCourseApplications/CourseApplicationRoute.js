const express = require("express")
const router = express.Router()
const subRouter = express.Router({mergeParams: true})
// const subRouter2 = express.Router({mergeParams: true})

const applicationService = require("./CourseApplicationService") 
const userService = require("../user/UserService")
const authenticationUtils = require("../../utils/AuthenticationUtils")

const isAuthenticated = authenticationUtils.isAuthenticated
const isAdmin = authenticationUtils.isAdmin

router.use('/myApplications', subRouter)
// router.use('/:degreeCourseID/degreeCourseApplications', subRouter2)


//#region get all applications OR from course OR from user
const getAllApplications = (req, res) => {
    console.log('\nstart: get all applications')
    
    const searchQuery = req.query
    const courseID = searchQuery.courseDegreeID
    const applicantUserID = searchQuery.applicantUserID

    const getAllApplicationsService = (err, applications) => {
        if(err) {
            console.log('finish: get all applications')
            res.status(404).send({error: `error getting applications: ${err.message}`})
            return            
        }
        if(!applications) {
            console.log('finish: get all applications')
            res.status(404).send({error: `error getting applications: ${err.message}`})
            return            
        }

        const modifiedApplications = applications.map((application) => {
            return {
                id: application._id,
                applicantUserID: application.applicantUserID,
                degreeCourseID: application.degreeCourseID,
                targetPeriodYear: application.targetPeriodYear,
                targetPeriodShortName: application.targetPeriodShortName
            }
        })
        
        console.log('finish: get all applications')
        res.send(Object.values(modifiedApplications))
    }

    // get applications by course
    if(courseID !== undefined) {
        applicationService.getApplicationsByCourse(courseID, getAllApplicationsService)
        return
    }

    // get applications by user id
    if(applicantUserID !== undefined) {
        applicationService.getApplicationsByUserID(applicantUserID, getAllApplicationsService)
        return
    }

    // get all applications
    applicationService.getApplications(getAllApplicationsService)
}

router.get("/", isAuthenticated, isAdmin, getAllApplications)
//#endregion get all applications OR from course OR from user


// //#region get applications by course
// const getAllApplicationsByCourse = () => {
//     console.log('\nstart: get all applications by course')

//     const courseID = searchQuery.degreeCourseID

//     const getAllApplicationsService = (err, applications) => {
//         if(err) {
//             console.log('finish: get all applications by course')
//             res.status(404).send({error: `error getting applications: ${err.message}`})
//             return            
//         }
//         if(!applications) {
//             console.log('finish: get all applications')
//             res.status(404).send({error: `error getting applications: ${err.message}`})
//             return            
//         }

//         const modifiedApplications = applications.map((application) => {
//             return {
//                 id: application._id,
//                 applicantUserID: application.applicantUserID,
//                 degreeCourseID: application.degreeCourseID,
//                 targetPeriodYear: application.targetPeriodYear,
//                 targetPeriodShortName: application.targetPeriodShortName
//             }
//         })
        
//         console.log('finish: get all applications by course')
//         res.send(Object.values(modifiedApplications))
//     }

//     applicationService.getApplicationsByCourse(courseID, getAllApplicationsService)
// }
// subRouter2.get("/", isAuthenticated, isAdmin, getAllApplicationsByCourse)
// //#endregion


//#region get application by id
const getApplicationByID = (req, res) => {
    console.log('\nstart: get course application by id process')
    const applicationID = req.params.courseApplicationID

    const getApplicationByIDService = (err, application) => {
        if(err) {
            res.send({error: `Error while trying to search for application: ${applicationID}`})
            console.log('finish: get application by id process')
            return
        }
        if(!application) {
            res.status(404).send({error: `error getting application: ${err.message}`})
            console.log('finish: get application by id process')
            return
        }

        const modifiedApplication =  {
            id: application._id,
            applicantUserID: application.applicantUserID,
            degreeCourseID: application.degreeCourseID,
            targetPeriodYear: application.targetPeriodYear,
            targetPeriodShortName: application.targetPeriodShortName
        }
        
        console.log('finish: get application by id process')
        res.send(modifiedApplication)
    }
    
    applicationService.getApplicationByID(applicationID, getApplicationByIDService)
}

router.get("/:courseApplicationID", isAuthenticated, isAdmin, getApplicationByID)
//#endregion get application by id


//#region get applications from user
const getApplicationsFromCurrentUser = (req, res) => {
    console.log('\nstart: get course application from current user process')
    const userID = req.userID

    const getApplicationsFromCurrentUserService = (err, applications) => {
        if(err) {
            res.send({error: `Error while trying to search for applications from: ${userID}`})
            console.log('finish: get application from current user process')
            return
        }
        if(!applications) {
            res.status(404).send({error: `error getting application: ${err.message}`})
            console.log('finish: get application from current user process')
            return
        }

        const modifiedApplications = applications.map((application) => {
            return {
                id: application._id,
                applicantUserID: application.applicantUserID,
                degreeCourseID: application.degreeCourseID,
                targetPeriodYear: application.targetPeriodYear,
                targetPeriodShortName: application.targetPeriodShortName
            }
        })
        
        console.log('finish: get application from current user process')
        res.send(modifiedApplications)
    }
    
    applicationService.getApplicationsFromUser(userID, getApplicationsFromCurrentUserService)
}

subRouter.get("/", isAuthenticated, getApplicationsFromCurrentUser)
//#endregion get applications from current user


//#region create application
const createApplication = (req, res) => {
    console.log('\nstart: create application process')
    const applicationProps = req.body
    const applicantUserID = applicationProps.applicantUserID
    const userIDCreating = req.userID

    const createApplicationService = (err, application) => {
        if(err) {
            console.log('finish: create application process')
            res.status(400).send({error:`error creating new application: ${err.message}`})
            return
        }

        const modifiedApplication =  {
            id: application._id,
            applicantUserID: application.applicantUserID,
            degreeCourseID: application.degreeCourseID,
            targetPeriodYear: application.targetPeriodYear,
            targetPeriodShortName: application.targetPeriodShortName
        }

        console.log(`created application for: '${userIDCreating}'`)
        console.log('finish: create application process')
        res.status(201).send(modifiedApplication)
    }

    applicationService.createApplication(userIDCreating, applicantUserID, applicationProps, createApplicationService)


    // const checkIfAdmin = (err, userCreating) => {
    //     if(err) {
    //         console.log('finish: create application process')
    //         res.send({error: `Error while trying to identify admin rights for user: ${userIDSearching}`})
    //         return
    //     }

    //     if(!userCreating.isAdministrator) {
    //         if(applicantUserID !== undefined) {
    //             console.log('user cannot create application for another user')
    //             console.log('finish: create application process')
    //             res.status(401).send({error: `Not authorized to create application for user: '${applicationProps.applicantID}`})
    //             return
    //         }

    //         console.log('user creating application for himself')
    //         applicationProps.applicantUserID = userIDCreating
    //         applicationService.createApplication(userIDCreating, applicationProps, createApplicationService)
    //         return
    //     }

    //     console.log('admin creating application')
    //     applicationService.createApplication(userIDCreating, applicationProps, createApplicationService)
    // }

    // // check if user is admin 
    // userService.getUserByID(userIDCreating, checkIfAdmin)
}

router.post("/", isAuthenticated, createApplication)
//#endregion create application


//#region create application
// const createApplication = (req, res) => {
//     console.log('\nstart: create application process')
//     const applicationProps = req.body
//     const applicantUserID = applicationProps.applicantUserID
//     const userIDCreating = req.userID

//     const createApplicationService = (err, application) => {
//         if(!application) {
//             console.log('finish: create application process')
//             res.status(400).send({error:`error creating new application: ${err.message}`})
//             return
//         }

//         const modifiedApplication =  {
//             id: application._id,
//             applicantUserID: application.applicantUserID,
//             degreeCourseID: application.degreeCourseID,
//             targetPeriodYear: application.targetPeriodYear,
//             targetPeriodShortName: application.targetPeriodShortName
//         }

//         console.log(`created application for: '${userIDCreating}'`)
//         console.log('finish: create application process')
//         res.status(201).send(modifiedApplication)
//     }

//     const checkIfAdmin = (err, userCreating) => {
//         if(err) {
//             console.log('finish: create application process')
//             res.send({error: `Error while trying to identify admin rights for user: ${userIDSearching}`})
//             return
//         }

//         if(!userCreating.isAdministrator) {
//             if(applicantUserID !== undefined) {
//                 console.log('user cannot create application for another user')
//                 console.log('finish: create application process')
//                 res.status(401).send({error: `Not authorized to create application for user: '${applicationProps.applicantID}`})
//                 return
//             }

//             console.log('user creating application for himself')
//             applicationProps.applicantUserID = userIDCreating
//             applicationService.createApplication(userIDCreating, applicationProps, createApplicationService)
//             return
//         }

//         console.log('admin creating application')
//         applicationService.createApplication(userIDCreating, applicationProps, createApplicationService)
//     }

//     // check if user is admin 
//     userService.getUserByID(userIDCreating, checkIfAdmin)
// }

// router.post("/", isAuthenticated, createApplication)
//#endregion create application


//#region update course application by id
const updateApplicationByID = (req, res) => {
    console.log('\nstart: update course application')

    const applicationID = req.params.applicationID
    const props = req.body

    const updateApplicationService = (err, application) => {
        if(err) {
            console.log('finish: update application')
            res.send({error: `error updating application: ${err.message}`})
            return
        }
        if(!application) {
            console.log('finish: update application')
            res.send({error: `error updating application: ${err.message}`})
            return
        }

        const modifiedApplication =  {
            id: application._id,
            applicantUserID: application.applicantUserID,
            degreeCourseID: application.degreeCourseID,
            targetPeriodYear: application.targetPeriodYear,
            targetPeriodShortName: application.targetPeriodShortName
        }

        console.log('finish: update application')
        res.status(201).send(modifiedApplication)
    }

    applicationService.updateApplicationByID(applicationID, props, updateApplicationService)
}

router.put("/:applicationID", isAuthenticated, isAdmin, updateApplicationByID)
//#endregion update course application by id


//#region delete application
const deleteApplication = (req, res) => {
    console.log('\nstart: delete course process')
    
    const applicationID = req.params.applicationID
    const deleteApplicationService = (err, application) => {
        if(err) {
            console.log('finish: delete application process')
            res.send({error: `error deleting application: ${err.message}`})
            return
        }
        if(!application) {
            console.log('finish: delete application process')
            res.send({error: `error deleting application: '${applicationID}'`})
            return
        }

        const modifiedApplication =  {
            id: application._id,
            applicantUserID: application.applicantUserID,
            degreeCourseID: application.degreeCourseID,
            targetPeriodYear: application.targetPeriodYear,
            targetPeriodShortName: application.targetPeriodShortName
        }

        console.log('finish: delete application process')
        res.status(201).send(modifiedApplication)
    }

    applicationService.deleteApplication(applicationID, deleteApplicationService)
}

router.delete("/:applicationID", isAuthenticated, isAdmin, deleteApplication)
//#endregion delete application


module.exports = router