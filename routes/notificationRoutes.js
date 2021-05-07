const express = require("express");
const app = express();
const router = express.Router();

router.get("/", (req, res, next) => {
	const payload = createPayload("Notifications", req.session.user);
	res.status(200).render("notificationPage", payload);
});

function createPayload(title, userLoggedIn) {
	return {
		pageTitle: title,
		userLoggedIn: userLoggedIn,
		userLoggedInJs: JSON.stringify(userLoggedIn),
	};
}

module.exports = router;
