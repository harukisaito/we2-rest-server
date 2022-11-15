const express = require("express")
const router = express.Router()

const userService = require("./UserService") 
const authenticationUtils = require("../../utils/AuthenticationUtils")

const isAuthenticated = authenticationUtils.isAuthenticated
const isAdmin = authenticationUtils.isAdmin


//#region get all users 
const getAllUsers = (req, res) => {
    console.log('\nstart: get all users')
    const getAllUsersService = (err, users) => {
        if(!users) {
            console.log('finish: get all users')
            res.status(404).send({error: `error getting users: ${err.message}`})
            return            
        }

        let counter = 0
        let modifiedUsers = []

        for(let user of users) {
            const userToSend = {
                _id: user._id,
                userID: user.userID,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdministrator: user.isAdministrator
            }
            
            modifiedUsers[counter] = userToSend
            counter++
        }
        
        console.log('finish: get all users')
        res.send(Object.values(modifiedUsers))
    }

    userService.getUsers(getAllUsersService)
}

router.get("/", isAuthenticated, isAdmin, getAllUsers)
//#endregion get all users


//#region get user by id
const getUserByID = (req, res) => {
    console.log('\nstart: get user by id process')
    const userIDToBeSearched = req.params.userID
    const userIDSearching = req.userID

    const getUserByIDService = (err, user) => {
        if(err) {
            res.send({error: `Error while trying to search for user: ${userIDToBeSearched}`})
            console.log('finish: get user by id process')
            return
        }
        if(!user) {
            res.status(404).send({error: `error getting user: ${err.message}`})
            console.log('finish: get user by id process')
            return
        }
        
        const userToSend = {
            _id: user._id,
            userID: user.userID,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdministrator: user.isAdministrator
        }
        
        console.log('finish: get user by id process')
        res.send(userToSend)
    }

    const checkIfAdmin = (err, userSearching) => {
        if(err) {
            res.send({error: `Error while trying to identify admin rights for user: ${userIDSearching}`})
            return
        }
        // users can only get themselves
        // admins can get all users by id
        if(!userSearching.isAdministrator) {
            if(userIDSearching !== userIDToBeSearched) {
                res.status(401).send({error: `Not authorized to access user: '${userIDToBeSearched}`})
                return
            }
        }
        
        console.log('searching user is admin')
        userService.getUserByID(userIDToBeSearched, getUserByIDService)
    }

    
    // check if user is admin 
    userService.getUserByID(userIDSearching, checkIfAdmin)
}

router.get("/:userID", isAuthenticated, getUserByID)
//#endregion get user by id


//#region create user
const createUser = (req, res) => {
    console.log('\nstart: create user process')
    const userProps = req.body
    const createUserService = (err, user) => {
        if(!user) {
            console.log('finish: create user process')
            res.status(400).send({error:`error creating new user: ${err.message}`})
            return
        }

        const userToSend = {
            _id: user._id,
            userID: user.userID,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdministrator: user.isAdministrator
        }

        console.log(`created user: '${user.userID}'`)
        console.log('finish: create user process')
        res.status(201).send(userToSend)
    }

    userService.createUser(userProps, createUserService)
}

router.post("/", isAuthenticated, isAdmin, createUser)
//#endregion create user


//#region update user by id
const updateUserByID = (req, res) => {
    console.log('\nstart: update user')

    const userIDToBeUpdated = req.params.userID
    const userIDUpdating = req.userID
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const isAdministrator = req.body.isAdministrator
    
    const updatedUserPropsIfAdmin = {
        firstName: firstName,
        lastName: lastName,
        isAdministrator: isAdministrator
    }
    const updatedUserPropsIfUser = {
        firstName: firstName,
        lastName: lastName
    }

    const updateUserService = (err, user) => {
        if(!user) {
            console.log('finish: update user')
            res.send({error: `error updating user: ${err.message}`})
            return
        }

        const userToSend = {
            _id: user._id,
            userID: user.userID,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdministrator: user.isAdministrator
        }

        console.log('finish: update user')
        res.status(201).send(userToSend)
    }

    const checkIfAdmin = (err, userUpdating) => {
        if(err) {
            console.log('finish: update user')
            res.send({error: `Error while trying to identify admin rights for user: ${userIDUpdating}`})
            return
        }
        if(!userUpdating.isAdministrator) {
            // users can only update themselves and limited information
            if(userIDUpdating !== userIDToBeUpdated) {
                console.log('finish: update user')
                res.status(401).send({error: `Not authorized to access user: '${userIDToBeUpdated}`})
                return
            }

            userService.updateUser(userIDToBeUpdated, updatedUserPropsIfUser, updateUserService)
            return
        }

        console.log('updating user is admin')
        // admins can update all users and more information
        userService.updateUser(userIDToBeUpdated, updatedUserPropsIfAdmin, updateUserService)
    }

    // check if user is admin 
    userService.getUserByID(userIDUpdating, checkIfAdmin)
}

router.put("/:userID", isAuthenticated, updateUserByID)
//#endregion update user by id


//#region delete user
const deleteUser = (req, res) => {
    console.log('\nstart: delete user process')
    const userID = req.params.userID
    const deleteUserService = (err, user) => {
        if(err) {
            console.log('finish: delete user process')
            res.send({error: `error deleting user: ${err.message}`})
            return
        }
        if(!user) {
            console.log('finish: delete user process')
            res.send({error: `error deleting user: '${userID}'`})
            return
        }

        const userToSend = {
            _id: user._id,
            userID: user.userID,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdministrator: user.isAdministrator
        }

        console.log('finish: delete user process')
        res.status(201).send(userToSend)
    }

    userService.deleteUser(userID, deleteUserService)
}

router.delete("/:userID", isAuthenticated, isAdmin, deleteUser)
//#endregion delete user



module.exports = router