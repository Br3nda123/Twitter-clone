const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);

class Database {
	constructor() {
		this.connect();
	}
	connect() {
		mongoose
			.connect(
				"mongodb+srv://TwitterCloneDB:dbuserpas@twitterclonecluster.uv9fz.mongodb.net/TwitterCloneDB?retryWrites=true&w=majority"
			)
			.then(() => {
				console.log("database conection successful");
			})
			.catch((err) => {
				console.log("database conection failed ");
			});
	}
}

module.exports = new Database();
