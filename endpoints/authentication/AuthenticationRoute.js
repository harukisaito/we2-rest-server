const express = require("express")
const authenticationService = require("./AuthenticationService")

const router = express.Router()

const authenticate = async (req, res) => {
    console.log('\nstart: authenticate user')
    const authorizationHeaderIsMissing = () => {
        return !req.headers.authorization
    }
    const notBasicAuthorization = () => {
        return req.headers.authorization.indexOf("Basic ") === -1
    }

    // ask for authorization if info is missing rest request call
    if (authorizationHeaderIsMissing() || notBasicAuthorization()) {
        res.statusCode = 401 // set status code
        res.setHeader("WWW-Authenticate", "Basic realm=\"Secure Area\"") // makes browser show login window
        return res.json({ message: "Missing Authorization Header" }) // sends this message
    }

    // encode user id and password
    const base64Credentials = req.headers.authorization.split(" ")[1] // 'Basic YWRtaW46MTIz'
    const credentials = Buffer.from(base64Credentials, "base64").toString("ascii") // transform YWRtaW46MTIz to ascii
    const [userID, password] = credentials.split(":") // YWRtaW46MTIz = <userID>:<password>
    const userCredentials = {userID, password} 
    const createTokenHandler = (err, token, user) => {
        if(!token) {
            console.log(`token has not been created`)
            console.log('finish: authenticate user')
            res.statusCode = 401
            res.send({Error: `Could not create token: ${err.message}`})
            return
        }
        if(!user) {
            const msg = `user is null, even though token has been created: \n${err.message}`
            console.log(msg)
            console.log('finish: authenticate user')
            res.send({error: msg})
            return
        }

        const userToSend = {
            _id: user._id,
            userID: user.userID,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdministrator: user.isAdministrator
        }
        
        // set header
        console.log('set token in response header')
        console.log('finish: authenticate user')
        res.header("Authorization", "Bearer " + token)
        res.send(userToSend)
    }

    authenticationService.createSessionToken(userCredentials, createTokenHandler)
}

router.get("/", authenticate) 



module.exports = router