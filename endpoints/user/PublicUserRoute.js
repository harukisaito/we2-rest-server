const express = require("express")
const router = express.Router()

const userService = require("./UserService") 



//#region get all users 
const getAllUsersHandler = (req, res) => {
    const getAllUsersServiceHandler = (err, users) => {
        if(!users) {
            res.status(404).send({error: `error getting users \n${err.message}`})
            return
        }

        res.send(Object.values(users))
    }

    userService.getUsers(getAllUsersServiceHandler)
}

router.get("/", getAllUsersHandler)
//#endregion get all users


//#region get user by id
const getUserByIDHandler = (req, res) => {
    const userID = req.url.split('/')[1]
    const getUserByIDServiceHandler = (err, user) => {
        if(!user) {
            res.status(404).send({error: `error getting user \n${err.message}`})
            return
        }
        
        res.send(user)
    }

    userService.getUserByID(userID, getUserByIDServiceHandler)
}

router.get("/:userID", getUserByIDHandler)
//#endregion get user by id


//#region create user
const createUserHandler = (req, res) => {
    const userProps = req.body
    const createUserServiceHandler = (err, user) => {
        if(!user) {
            res.status(400).send({error: `error creating new user \n${err.message}`})
            return
        }

        res.status(201).json(user)
    }

    userService.createUser(userProps, createUserServiceHandler)
}

router.post("/", createUserHandler)
//#endregion create user


//#region update user by id
const updateUserByIDHandler = (req, res) => {
    const userID = req.url.split('/')[1]
    const updatedUserProps = req.body
    const updateUserServiceHandler = (err, user) => {
        if(!user) {
            res.send({error: `error updating user \n${err.message}`})
            return
        }

        res.json(user)
    }

    userService.updateUser(userID, updatedUserProps, updateUserServiceHandler)
}

router.put("/:userID", updateUserByIDHandler)
//#endregion update user by id


//#region delete user
const deleteUserHandler = (req, res) => {
    const userID = req.url.split('/')[1]
    const deleteUserServiceHandler = (err, user) => {
        if(!user) {
            res.send({error: `error deleting user \n${err.message}`})
            return
        }

        res.json(user)
    }

    userService.deleteUser(userID, deleteUserServiceHandler)
}

router.delete("/:userID", deleteUserHandler)
//#endregion delete user



module.exports = router