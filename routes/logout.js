const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
	if (req.session) {
		// console.log(req.session);
		// req.session.destroy(() => {
		// });
		req.session = null;
		res.redirect("/login");
	}
});

module.exports = router;
