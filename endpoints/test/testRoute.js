const express = require("express")
const router = express.Router()

const userService = require("../user/UserService") 
const applicationService = require("../degreeCourseApplications/CourseApplicationService") 
const authenticationUtils = require("../../utils/AuthenticationUtils")

const isAuthenticated = authenticationUtils.isAuthenticated


const getMyData = (req, res) => {
    console.log('\nstart: get course by id process')

    const userID = req.userID
    let userToSend

    const getUserByIDService = (err, user) => {
        if(err) {
            res.send({error: `Error while trying to search for user: ${userID}`})
            console.log('finish: get user by id process')
            return
        }
        if(!user) {
            res.status(404).send({error: `error getting user: ${err.message}`})
            console.log('finish: get user by id process')
            return
        }
        
        userToSend = {
            id: user._id,
            userID: user.userID,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdministrator: user.isAdministrator
        }
        
        console.log('finish: get user by id process')

        applicationService.getApplicationsFromUser(userID, getApplicationsFromCurrentUserService)
    }

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

        const response = {
            user: userToSend,
            applications: modifiedApplications
        }
        
        console.log('finish: get application from current user process')

        res.send(response)
    }
    
    userService.getUserByID(userID, userID, getUserByIDService)

}

router.get("/getMyData", isAuthenticated, getMyData)

module.exports = router
