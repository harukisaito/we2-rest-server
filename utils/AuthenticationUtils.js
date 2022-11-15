const config = require("config")
const jwt = require("jsonwebtoken")
const userService = require("../endpoints/user/UserService")

const isAuthenticated = (req, res, next) => {
    const tokenIsInHeader = () => {
        return typeof req.headers.authorization !== "undefined" || 
                      req.headers.authorization !== undefined
    }

    if (!tokenIsInHeader()) {   
        console.log("no token in header given")
        res.status(401).json({ error: "Not Authorized" })
        return
    }

    // Authorization header looks like this:
    // Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC
    // J9.eyJ1c2VySUQiOiJhZG1pbiIsImlhdCI6MTY2Nz
    // MxOTUwMywiZXhwIjoxNjY4OTg3MTIyODc5fQ.o6CF
    // dHmuKM9z9O1cBEAFcdKcezCAYWKiTwMzDWS_A0Y
    
    // privatekey is in config locally
    
    const token = req.headers.authorization.split(" ")[1]
    const privateKey = config.get("session.tokenKey")
    const algorithm = {algorithm: "HS256"}
    const jwtVerifyHandler = (err, user) => {
        if (err) {
            console.log("error while authenticating")
            res.status(401).json({ error: "Not Authorized" })
            return
        }
        if(!user) {
            console.log("error while authenticating, no user")
            res.status(401).json({ error: "Could not find user" })
            return
        }
        
        const userID = user.userID
        req.userID = userID
        
        console.log(`\nauthenticated as: '${userID}'`)
        return next()
    }

    jwt.verify(token, privateKey, algorithm, jwtVerifyHandler)
}

const isAdmin = (req, res, next) => {
    const userID = req.userID
    const getUserHandler = (err, user) => {
        if(err) {
            res.status(401).json({ message: err.message })
            return
        }
        if(!user.isAdministrator) {
            res.status(401).json({ message: "Not authorized to access all users." })
            return
        }
        
        console.log('authorised as admin')
        return next()
    }

    userService.getUserByID(userID, getUserHandler) 
}

module.exports = {
    isAuthenticated,
    isAdmin
}