const express = require("express")
const router = express.Router()

const userService = require("./UserService")



// get all users
router.get("/", (req, res) => 
{
    const getAllUsersHandler = (err, result) => {
        if(result) {
            res.send(Object.values(result))
        }
        else {
            res.status(404).send(`error getting users \n${err.message}`)
        }
    }

    userService.getUsers(getAllUsersHandler)
})

// get user by id
router.get("/:userID", (req, res) => 
{
    const userID = req.url.split('/')[1]
    const getUserByIDHandler = (err, result) => {
        if(result) {
            res.send(result)
        }
        else {
            res.status(404).send(`error getting user \n${err.message}`)
        }
    }

    userService.getUserByID(userID, getUserByIDHandler)
})

// create new user
router.post("/", (req, res) => 
{
    const userProps = req.body
    const createUserHandler = (err, result) => {
        if(result) {
            res.status(201).json(result)
        }
        else {
            res.status(400).send(`error creating new user \n${err.message}`)
        }
    }

    userService.createUser(userProps, createUserHandler)
})

// update user by id
router.put("/:userID", (req, res) => {
    const userID = req.url.split('/')[1]
    const updatedUserProps = req.body
    const updateUserHandler = (err, result) => {
        if(result) {
            res.json(result)
        }
        else {
            res.send(`error updating user \n${err.message}`)
        }
    }

    userService.updateUser(userID, updatedUserProps, updateUserHandler)
})

// delete user
router.delete("/:userID", (req, res) => {
    const userID = req.url.split('/')[1]
    const deleteUserHandler = (err, result) => {
        if(result) {
            res.json(result)
        }
        else {
            res.send(`error deleting user \n${err.message}`)
        }
    }

    userService.deleteUser(userID, deleteUserHandler)
})



module.exports = router