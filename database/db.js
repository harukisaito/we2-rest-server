const mongoose = require("mongoose")
const config = require("config")
const userService = require("../endpoints/user/UserService")

let db

const connectionString = config.get("db.connectionString")

const initDB = (callback) => {
    if(db) { // if database already exists 
        if(callback) {// if callback is delivered as parameter
            console.log("returning db as callback")
            return callback(null, db)
        }
        else {// if no callback function is in the parameter
            console.log("returning db")
            return db
        }
    }
    else { // first init of the mongoose connection
        mongoose.connect(connectionString, {}) // mongoose is the bridge between software and the database
        db = mongoose.connection

        db.on("error", console.error.bind(console, "connection error:"))
        db.once("open", () => {
            console.log("connected to db:        " + connectionString)
            
            const adminUserID = 'admin'
            const getUserHandler = (getErr, getResult) => {
                if(getErr) {
                    const createAdminHandler = (createErr, createResult) => {
                        if(createErr) {
                            console.log(`error creating admin: \n${createErr.message}`)
                        }
                    }

                    userService.createDefaultAdmin(createAdminHandler)
                }
                else {
                    console.log('dont create default admin account because he already exists')
                }
            }

            userService.getUserByID(adminUserID, getUserHandler)

            callback(null, db) // no return needed because there is no code after this that has to be executed
        })
    }
}

module.exports = {
    initDB
}