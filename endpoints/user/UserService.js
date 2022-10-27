const User = require("./UserModel")

const getUsers = (callback) => {
    const handler = (err, users) => {
        if(err) {
            console.log(`error trying to find users in db \n${err.message}`)
            return callback(err, null)
        }
        else {
            console.log("returning list of users in db")
            return callback(null, users)
        }
    }
    
    User.find(handler)
    // find is provided by mongoose
    // find user by defined usermodel
}

const getUserByID = (userID, callback) => {
    if(!userID) {
        return callback({message: "user id is missing"})
    }
    else {
        const userObj = {userID: userID}
        const findUserHandler = (err, user) => {
            if(err) {
                console.log(`error while searching for user '${userID}' \n${err}`)
                return callback(err, null)
            }
        
            if(user) {
                console.log(`found user: '${userID}'`)
                callback(null, user)
            }
            else {
                const msg = `could not find user: '${userID}'`
                console.log(msg);
                return callback({message: msg}, null)
            }
        }

        // findOne is provided by mongoose
        User.findOne(userObj, findUserHandler)
    }
}

const createUser = (props, callback) => {
    const userID = props.userID
    const userObj = {userID: userID}
    const findUserHandler = (err, user) => {
        const createUser = () => {
            const userSaveHandler = (err, user) => {
                if(err) {
                    console.log(`error while saving user: '${userID}' \n${err.message}`)
                    return callback(err, null)
                }
                else {
                    console.log(`saved user: '${userID}'`)
                    return callback(null, user)
                }
            }

            const user = new User({
                userID: userID,
                firstName: props.firstName,
                lastName: props.lastName,
                password: props.password,
                isAdministrator: props.isAdministrator
            })
            
            user.save(userSaveHandler)
        }

        if(err) {
            return callback(err, null)
        }

        if(!user) {
            createUser()
        }
        else {
            let msg = `user '${userID}' already exists`
            console.log(msg)
            return callback({message: msg}, null)
        }
    }

    if(userID == null) {
        return callback({message: 'User ID is missing'}, null)
    }

    // findOne is provided by mongoose
    User.findOne(userObj, findUserHandler)
}    

const updateUser = (userID, props, callback) => {
    const userObj = {userID: userID}
    const findAndUpdateUserHandler = (err, user) => {
        const updateAndSafeUser = (user) => {
            const saveUserHandler = (err, user) => {
                if(err) {
                    console.log(`error updating user: '${userID}' \n${err}`)
                    return callback(err, null)
                }
        
                if(user) {
                    console.log(`updated user '${userID}'`)
                    return callback(null, user)
                }
                else {
                    let msg = `could not save user: '${userID}' while updating`
                    console.log(msg)
                    return callback({message: msg}, null)
                }
            } 

            Object.assign(user, props)
            user.save(saveUserHandler)
        }

        if(err) {
            console.log(err)
            return callback(err, null)
        }

        if(user) {
            updateAndSafeUser(user)
        }
        else { 
            let msg = `user: '${userID}' does not exist`
            console.log(msg)
            return callback({message: msg}, null)
        }
    }

    User.findOne(userObj, findAndUpdateUserHandler)
} 

const deleteUser = (userID, callback) => 
{
    const userObj = {userID: userID}
    const findAndRemoveUserHandler = (err, user) => {
        if(err) {
            console.log(`error deleting user: '${userID}' \n${err}`)
            return callback(err, null)
        }

        if(user) {
            console.log(`deleted user: '${userID}'`)
            return callback(null, user)
        }
        else {
            let msg = `could not find user: '${userID}'`
            console.log(msg)
            return callback({message: msg}, null)
        }
    }

    User.findOneAndRemove(userObj, findAndRemoveUserHandler)
}



module.exports = {
    getUsers,
    getUserByID,
    createUser,
    updateUser,
    deleteUser
}