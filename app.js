const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const middleware = require("./middleware");
const bodyParser = require("body-parser");
const mongoose = require("./database");
const session = require("express-session");

const port = 3003;

const app = express();

const server = app.listen(port, () =>
	console.log("Server listening on port" + port)
);
const io = require("socket.io")(server, { pingTimeout: 60000 });

// view engine setup
app.set("view engine", "pug");
app.set("views", "./views");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
	session({
		secret: "abc",
		resave: true,
		saveUninitialized: false,
	})
);

// Routes
const loginRoute = require("./routes/loginRoutes");
const registerRoute = require("./routes/registerRoutes");
const postRoute = require("./routes/postRoutes");
const profileRoute = require("./routes/profileRoutes");
const uploadRoute = require("./routes/uploadRoutes");
const searchRoute = require("./routes/searchRoutes");
const messagesRoute = require("./routes/messagesRoutes");
const notificationRoute = require("./routes/notificationRoutes");
const logoutRoute = require("./routes/logout");

// Api routes
const postsApiRoute = require("./routes/api/posts");
const usersApiRoute = require("./routes/api/users");
const chatsApiRoute = require("./routes/api/chats");
const messagesApiRoute = require("./routes/api/messages");
const notificationsApiRoute = require("./routes/api/notifications");

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/post", middleware.requireLogin, postRoute);
app.use("/profile", middleware.requireLogin, profileRoute);
app.use("/uploads", uploadRoute);
app.use("/search", middleware.requireLogin, searchRoute);
app.use("/messages", middleware.requireLogin, messagesRoute);
app.use("/notifications", middleware.requireLogin, notificationRoute);
app.use("/logout", logoutRoute);

app.use("/api/posts", postsApiRoute);
app.use("/api/users", usersApiRoute);
app.use("/api/chats", chatsApiRoute);
app.use("/api/messages", messagesApiRoute);
app.use("/api/notifications", notificationsApiRoute);

app.get("/", middleware.requireLogin, (req, res, next) => {
	const payload = {
		pageTitle: "Home",
		userLoggedIn: req.session.user,
		userLoggedInJs: JSON.stringify(req.session.user),
	};

	res.status(200).render("home", payload);
});

io.on("connection", (client) => {
	client.on("setup", (userData) => {
		client.join(userData._id);
		client.emit("connected");
	});

	client.on("join room", (room) => client.join(room));
	client.on("typing", (room) => client.in(room).emit("typing"));
	client.on("stop typing", (room) => client.in(room).emit("stop typing"));
	client.on("notification received", (room) =>
		client.in(room).emit("notification received")
	);

	client.on("new message", (newMessage) => {
		const chat = newMessage.chat;

		if (!chat.users) return console.log("Chat.users not defined");

		chat.users.forEach((user) => {
			if (user._id == newMessage.sender._id) return;

			client.in(user._id).emit("message received", newMessage);
		});
	});
});

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
