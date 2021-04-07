const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	firstName: {
		type: String,
		reqiured: true,
		trim: true,
	},
	lastName: {
		type: String,
		reqiured: true,
		trim: true,
	},
	username: {
		type: String,
		reqiured: true,
		trim: true,
		unique: true,
	},
	email: {
		type: String,
		reqiured: true,
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		reqiured: true,
	},
	profilePic: {
		type: String,
		default: "/images/profilePic.png",
	},
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
