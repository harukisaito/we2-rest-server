const express = require("express")
const router = express.Router()

const userService = require("./UserService")
const authenticationUtils = require("../../utils/AuthenticationUtils")



// get all users
router.get(
    "/", 
    authenticationUtils.isAuthenticated, 
    authenticationUtils.isAdmin, 

    (req, res) => {
        userService.getUsers( (err, result) => {
            if(result) {
                res.send(Object.values(result))
            }
            else {
                res.send("problems with getting users")
            }
        })
    }
)

// create new user
router.post(
    "/", 
    authenticationUtils.isAuthenticated, 
    authenticationUtils.isAdmin, 

    (req, res) => {
        userService.createUser( req.body, (err, result) => {
            if(result) {
                res.json(result)
            }
            else {
                res.json(
                    {
                        message: err.message
                    })
            }
        })
    }
)

// get user by id
router.post(
    "/getByUserID/", 
    authenticationUtils.isAuthenticated, 
    authenticationUtils.isAdmin, 

    (req, res) => {
        userService.findUserByID(req.body, (err, result) => {
            if(result) {
                res.json(result)
            }
            else {
                res.json({
                        message: err.message
                    })
            }
        })
    }
)

// update user
router.put(
    "/", 
    authenticationUtils.isAuthenticated, 
    authenticationUtils.isAdmin,
    
    (req, res) => {
        userService.updateUser(req.body, (err, result) => {
            if(result) {
                res.json(result)
            }
            else {
                res.json({
                    message: err.message
                })
            }
        })
    }
)

// delete user
router.delete(
    "/", 
    authenticationUtils.isAuthenticated, 
    authenticationUtils.isAdmin,
    
    (req, res) => {
        userService.deleteUser(req.body, (err, result) => {
            if(result) {
                res.json(result)
            }
            else {
                res.json({
                    message: err.message
                })
            }
        })
    }
)



module.exports = router