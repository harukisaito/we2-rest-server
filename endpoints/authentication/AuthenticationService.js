const userService = require("../user/UserService")
const jwt = require("jsonwebtoken")
const config = require("config")

const createSessionToken = (userCredentials, callback) => {
    const userID = userCredentials.userID
    const password = userCredentials.password

    const getUserHandler = (err, user) => {
        if(err) {
            console.log(`error finding user  \n${err.message}`)
            return callback(err, null)
        }
        if(!user) {
            return callback({message: "did not find user"}, null)
        }

        const comparePasswordHandler = (err, isMatch) => {
            if(err) {
                console.log("password is invalid")
                return callback(err, null)
            }
            if(!isMatch) {
                console.log("password or user id is invalid")
                return callback({message: "password or user id is invalid"}, null)
            }
    
            const userIDObj = { "userID": user.userID }
            const privateKey = config.get("session.tokenKey")
            const issuedAt = new Date().getTime()
            const expirationTime = config.get("session.timeout")
            const expiresIn = issuedAt + (expirationTime * 1000)
            const expirationAndAlgorithmObj = {expiresIn: expiresIn, algorithm: "HS256"}
    
            let token = jwt.sign(
                userIDObj, 
                privateKey, 
                expirationAndAlgorithmObj
            )
    
            return callback(null, token, user)
        }

        user.comparePassword(password, comparePasswordHandler)
    }
    
    userService.getUserByID(userID, getUserHandler)
}

module.exports = {
    createSessionToken
}