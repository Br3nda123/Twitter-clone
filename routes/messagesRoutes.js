const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const User = require("../schemas/UserSchema");

router.get("/", (req, res, next) => {
	const payload = createPayload("Inbox", req.session.user);
	res.status(200).render("inboxPage", payload);
});

router.get("/new", (req, res, next) => {
	const payload = createPayload("New message", req.session.user);
	res.status(200).render("newMessage", payload);
});

function createPayload(title, userLoggedIn) {
	return {
		pageTitle: title,
		userLoggedIn: userLoggedIn,
		userLoggedInJs: JSON.stringify(userLoggedIn),
	};
}

module.exports = router;
