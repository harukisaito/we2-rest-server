const User = require("./UserModel")


// #region get users
const getUsers = (callback) => {
    const findUsers = (err, users) => {
        if(err) {
            console.log(`error trying to find users in db \n${err.message}`)
            return callback(err, null)
        }
        
        console.log("returning list of users in db")
        return callback(null, users)
    }
    
    User.find(findUsers)
}
// #endregion get users


// #region get user by id
const getUserByID = (userIDSearching, userIDToBeSearched, callback) => {
    if(!userIDToBeSearched) {
        return callback({message: "user id to be searched is missing"})
    }
    if(!userIDSearching) {
        return callback({message: "user id that is searching is missing"})
    }

    // console.log(userIDToBeSearched)
    // console.log(userIDSearching)

    const userObjSearching = {userID: userIDSearching}
    const userObjToBeSearched = {userID: userIDToBeSearched}

    const findUser = (err, user) => {
        if(err) {
            console.log(`error while searching for user '${userIDToBeSearched}' \n${err}`)
            return callback(err, null)
        }
        if(!user) {
            const msg = `could not find user: '${userIDToBeSearched}'`
            console.log(msg);
            return callback({message: msg}, null)
        }

        console.log(`found user: '${userIDToBeSearched}'`)
        callback(null, user)
    }

    const checkForRights = (err, user) => {
        if(err) {
            console.log(`error while searching for user '${userIDToBeSearched}' \n${err}`)
            return callback(err, null)
        }
        if(!user) {
            const msg = `could not find user: '${userIDToBeSearched}'`
            console.log(msg);
            return callback({message: msg}, null)
        }
        if(!user.isAdministrator && userIDToBeSearched !== userIDSearching) {
            const msg = 'user is not allowed to get another user'
            console.log(msg)
            return callback({message: msg}, null)
        }

        console.log('got through the rights check')
        User.findOne(userObjToBeSearched, findUser)
    }

    // check for rights first
    User.findOne(userObjSearching, checkForRights)
}
// #endregion get user by id


// #region create user
const createUser = (props, callback) => {
    const userID = props.userID
    const userObj = {userID: userID}

    if(userID == null) {
        return callback({message: 'User ID is missing'}, null)
    }

    const saveUser = (err, user) => {
        if(err) {
            console.log(`error while saving user: '${userID}' \n${err.message}`)
            return callback(err, null)
        }

        console.log(`saved user: '${userID}'`)
        return callback(null, user)
    }

    const createUser = () => {
        const user = new User({
            userID: userID,
            firstName: props.firstName,
            lastName: props.lastName,
            password: props.password,
            isAdministrator: props.isAdministrator
        })

        user.save(saveUser)
    }

    const findUserHandler = (err, user) => {
        if(err) {
            return callback(err, null)
        }
        if(user) { // already exists
            let msg = `user '${userID}' already exists`
            console.log(msg)
            return callback({message: msg}, null)
        }
        
        createUser()
    }

    User.findOne(userObj, findUserHandler)
}   
// #endregion create user


// #region create default admin
const createDefaultAdmin = (callback) => {
    const admin = new User({
        userID: 'admin',
        password: '123',
        isAdministrator: true
    })

    const saveAdmin = (err) => {
        if(err) {
            console.log(`error saving admin: \n${err.message}`)
            return callback({message: 'could not save admin user'}, null)
        }

        console.log('created default admin')
        return callback(null, admin)
    }

    admin.save(saveAdmin)
}
// #endregion create default admin


// #region update user
const updateUser = (userIDUpdating, userIDToBeUpdated, props, callback) => {

    let updatingUserIsAdmin
    const userObjUpdating = {userID: userIDUpdating}
    const userObjToBeUpdated = {userID: userIDToBeUpdated}


    const saveUser = (err, user) => {
        if(err) {
            console.log(`error updating user: '${userIDToBeUpdated}' \n${err}`)
            return callback(err, null)
        }
        if(!user) {
            let msg = `could not save user: '${userIDToBeUpdated}' while updating`
            console.log(msg)
            return callback({message: msg}, null)
        }

        console.log(`updated user '${userIDToBeUpdated}'`)
        return callback(null, user)
    } 

    const updateAndSafeUser = (user) => {
        const modifiedProps = {
            firstName: props.firstName,
            lastName: props.lastName,
        }

        if(!updatingUserIsAdmin) {
            Object.assign(user, modifiedProps)
        }
        else {
            Object.assign(user, props)
        }

        user.save(saveUser)
    }

    const findAndUpdateUser = (err, user) => {
        if(err) {
            console.log(err)
            return callback(err, null)
        }
        if(!user) {
            let msg = `user: '${userIDToBeUpdated}' does not exist`
            console.log(msg)
            return callback({message: msg}, null)
        }

        updateAndSafeUser(user)
    }

    const checkForRights = (err, user) => {
        if(err) {
            console.log(`error while updating for user '${userIDToBeUpdated}' \n${err}`)
            return callback(err, null)
        }
        if(!user) {
            const msg = `could not find user: '${userIDToBeUpdated}'`
            console.log(msg);
            return callback({message: msg}, null)
        }
        if(!user.isAdministrator && userIDToBeUpdated !== userIDUpdating) {
            const msg = 'user is not allowed to update another user'
            console.log(msg)
            return callback({message: msg}, null)
        }
        if(user.isAdministrator) {
            updatingUserIsAdmin = true
        }

        console.log('got through the rights check')
        User.findOne(userObjToBeUpdated, findAndUpdateUser)
    }

    // check for rights first
    User.findOne(userObjUpdating, checkForRights)
} 
// #endregion update User


// #region delete user 
const deleteUser = (userID, callback) => 
{
    const userObj = {userID: userID}
    const findAndRemoveUser = (err, user) => {
        if(err) {
            console.log(`error deleting user: '${userID}' \n${err}`)
            return callback(err, null)
        }

        if(!user) {
            let msg = `could not find user: '${userID}'`
            console.log(msg)
            return callback({message: msg}, null)
        }
        
        console.log(`deleted user: '${userID}'`)
        return callback(null, user)
    }

    User.findOneAndRemove(userObj, findAndRemoveUser)
}
// #endregion delete user


module.exports = {
    getUsers,
    getUserByID,
    createUser,
    updateUser,
    deleteUser,
    createDefaultAdmin
}