// external libs
const express = require("express")
const https = require("https")
const fs = require("fs")

// internal modules
const database = require("./database/db")

// routes
const publicUserRoutes = require("./endpoints/user/PublicUserRoute")
const authenticationRoute = require("./endpoints/authentication/AuthenticationRoute")
const userRoutes = require("./endpoints/user/UserRoute")
const courseRoutes = require("./endpoints/degreeCourses/CourseRoute")
const courseApplicationRoutes = require("./endpoints/degreeCourseApplications/CourseApplicationRoute")

const testRoute = require("./endpoints/test/testRoute")

const key = fs.readFileSync("./certificates/key.pem")
const cert = fs.readFileSync("./certificates/cert.pem")

// create express app
const app = express()

// allow express to handle json format
app.use(express.json())



setRoutes() // allow express to use the defined routes
initializeDatabase()
startServer()



function setRoutes () {
    app.use("/api/publicUsers", publicUserRoutes)
    app.use("/api/authenticate", authenticationRoute)
    app.use("/api/users", userRoutes)
    app.use("/api/degreeCourses", courseRoutes)
    app.use("/api/degreeCourseApplications", courseApplicationRoutes)
    app.use("/api/abnahme", testRoute)
}

function initializeDatabase () {
    database.initDB((err, db) => {
        if(err) {
            console.log("\nerror: database connection has failed")
        }
        if (!db) {
            console.log("\ndatabase connection has failed")
        }

        console.log("\ndatabase connection was successful")
    })
}

function startServer () {
    const port = 443
    const keyAndCert = {key, cert}
    const server = https.createServer(keyAndCert, app)

    server.listen(port, () => {
        console.log(`server is listening on: https://localhost:${port}`)
    })
}
