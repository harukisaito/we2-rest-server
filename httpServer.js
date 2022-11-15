// external libs
const express = require("express")

// internal modules
const database = require("./database/db")

// routes
const publicUserRoutes = require("./endpoints/user/PublicUserRoute")
const authenticationRoute = require("./endpoints/authentication/AuthenticationRoute")
const userRoutes = require("./endpoints/user/UserRoute")
const courseRoutes = require("./endpoints/degreeCourses/CourseRoute")

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
}

function initializeDatabase () {
    database.initDB((err, db) => {
        if (db) {
            console.log("\ndatabase connection was successful")
        }
        else {
            console.log("\ndatabase connection has failed")
        }
    })
}

function startServer () {
    const port = 80

    app.listen(port, () => {
        console.log(`server is listening on: http://localhost:${port}`)
    })
}
