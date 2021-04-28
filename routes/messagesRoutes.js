const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = require("../schemas/UserSchema");
const Chat = require("../schemas/ChatSchema");

router.get("/", (req, res, next) => {
	const payload = createPayload("Inbox", req.session.user);
	res.status(200).render("inboxPage", payload);
});

router.get("/new", (req, res, next) => {
	const payload = createPayload("New message", req.session.user);
	res.status(200).render("newMessage", payload);
});

router.get("/:chatId", async (req, res, next) => {
	const userId = req.session.user._id;
	const chatId = req.params.chatId;
	const isValidId = mongoose.isValidObjectId(chatId);

	const payload = createPayload("Chat", req.session.user);

	if (!isValidId) {
		payload.errorMessage =
			"Chat does exist or you do not have permission to view it.";
		return res.status(200).render("chatPage", payload);
	}

	let chat = await Chat.findOne({
		_id: chatId,
		users: { $elemMatch: { $eq: userId } },
	}).populate("users");

	if (chat == null) {
		// Check if chatId is really user Id
		const userFound = await User.findById(chatId);

		if (userFound != null) {
			chat = await getChatByUserId(userFound._id, userId);
		}
	}

	if (chat == null) {
		payload.errorMessage =
			"Chat does exist or you do not have permission to view it.";
	} else {
		payload.chat = chat;
	}

	res.status(200).render("chatPage", payload);
});

function createPayload(title, userLoggedIn) {
	return {
		pageTitle: title,
		userLoggedIn: userLoggedIn,
		userLoggedInJs: JSON.stringify(userLoggedIn),
	};
}

function getChatByUserId(userLoggedInId, otherUserId) {
	return Chat.findOneAndUpdate(
		{
			isGroupChat: false,
			users: {
				$size: 2,
				$all: [
					{ $elemMatch: { $eq: mongoose.Types.ObjectId(userLoggedInId) } },
					{ $elemMatch: { $eq: mongoose.Types.ObjectId(otherUserId) } },
				],
			},
		},
		{
			$setOnInsert: {
				users: [userLoggedInId, otherUserId],
			},
		},
		{
			new: true,
			upsert: true,
		}
	).populate("users");
}

module.exports = router;
