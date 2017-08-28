const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

let UserSchema = new mongoose.Schema({
	username: String,
	password: String
})

//add methods/feaures from p-l-mongoose package
UserSchema.plugin("passportLocalMongoose")

module.exports = mongoose.model("User",UserSchema)