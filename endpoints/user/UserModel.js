const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")



const UserSchema = new mongoose.Schema({
    userID: { type: String, unique: true },
    firstName: String,
    lastName: String,
    password: String,
    isAdministrator: { type: Boolean, default: false }
})



UserSchema.pre("save", function(next) {
    const user = this
    if(!user.isModified("password")) {
        return next()
    }

    bcrypt.hash(user.password, 10).then((hashedPassword) => {
        user.password = hashedPassword
        next()
    })
})

UserSchema.methods.comparePassword = function(candidatePassword, next) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if(err) {
            return next(err)
        }
        else {
            next(null, isMatch)
        }
    })
}



module.exports = mongoose.model("User", UserSchema)
