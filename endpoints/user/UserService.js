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
const getUserByID = (userID, callback) => {
    if(!userID) {
        return callback({message: "user id is missing"})
    }

    const userObj = {userID: userID}
    const findUser = (err, user) => {
        if(err) {
            console.log(`error while searching for user '${userID}' \n${err}`)
            return callback(err, null)
        }
        if(!user) {
            const msg = `could not find user: '${userID}'`
            console.log(msg);
            return callback({message: msg}, null)
        }

        console.log(`found user: '${userID}'`)
        callback(null, user)
    }

    User.findOne(userObj, findUser)
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
const updateUser = (userID, props, callback) => {
    const userObj = {userID: userID}
    const saveUser = (err, user) => {
        if(err) {
            console.log(`error updating user: '${userID}' \n${err}`)
            return callback(err, null)
        }
        if(!user) {
            let msg = `could not save user: '${userID}' while updating`
            console.log(msg)
            return callback({message: msg}, null)
        }

        console.log(`updated user '${userID}'`)
        return callback(null, user)
    } 

    const updateAndSafeUser = (user) => {
        Object.assign(user, props)

        // console.log(user)
        user.save(saveUser)
    }

    const findAndUpdateUser = (err, user) => {
        if(err) {
            console.log(err)
            return callback(err, null)
        }
        if(!user) {
            let msg = `user: '${userID}' does not exist`
            console.log(msg)
            return callback({message: msg}, null)
        }

        // console.log(user)

        updateAndSafeUser(user)
    }

    User.findOne(userObj, findAndUpdateUser)
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