const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");

const User = require("../../schemas/UserSchema");
const Post = require("../../schemas/PostSchema");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res, next) => {
	const searchObj = req.query;

	if (searchObj.isReply !== undefined) {
		const isReply = searchObj.isReply == "true";
		searchObj.replyTo = { $exists: isReply };
		delete searchObj.isReply;
	}

	if (searchObj.search !== undefined) {
		searchObj.content = { $regex: searchObj.search, $options: "i" };
		delete searchObj.search;
	}

	if (searchObj.followingOnly !== undefined) {
		const followingOnly = searchObj.followingOnly == "true";

		if (followingOnly) {
			let objectIds = [];
			if (!req.session.user.following) {
				req.session.user.following = [];
			}
			req.session.user.following.forEach((user) => {
				objectIds.push(user);
			});
			objectIds.push(req.session.user._id);

			searchObj.postedBy = { $in: objectIds };
		}
		delete searchObj.followingOnly;
	}

	const result = await getPosts(searchObj);
	return res.status(200).send(result);
});

router.get("/:id", async (req, res, next) => {
	const postId = req.params.id;

	const postData = (await getPosts({ _id: postId }))[0];

	const result = {
		postData,
	};

	if (postData.replyTo !== undefined) {
		result.replyTo = postData.replyTo;
	}

	result.replies = await getPosts({ replyTo: postId });

	return res.status(200).send(result);
});

router.post("/", async (req, res, next) => {
	if (!req.body.content) {
		console.log("Content param not sent with request");
		return res.sendStatus(400);
	}

	const postData = {
		content: req.body.content,
		postedBy: req.session.user,
	};

	if (req.body.replyTo) {
		postData.replyTo = req.body.replyTo;
	}

	Post.create(postData)
		.then(async (newPost) => {
			newPost = await User.populate(newPost, { path: "postedBy" });

			res.status(201).send(newPost);
		})
		.catch((error) => {
			console.log(error);
			res.sendStatus(400);
		});
});

router.put("/:id/like", async (req, res, next) => {
	const postId = req.params.id;
	const userId = req.session.user._id;

	const isLiked =
		req.session.user.likes && req.session.user.likes.includes(postId);

	const option = isLiked ? "$pull" : "$addToSet";
	// Wrócic do tego!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	// likes: likes.push(postId);
	// likes: likes.findIndex(postId).remove();

	// Insert user like
	req.session.user = await User.findByIdAndUpdate(
		userId,
		{ [option]: { likes: postId } },
		{ new: true }
	).catch((error) => {
		console.log(error);
		res.sendStatus(400);
	});

	// Insert post like
	const post = await Post.findByIdAndUpdate(
		postId,
		{ [option]: { likes: userId } },
		{ new: true }
	).catch((error) => {
		console.log(error);
		res.sendStatus(400);
	});

	res.status(200).send(post);
});

router.post("/:id/retweet", async (req, res, next) => {
	const postId = req.params.id;
	const userId = req.session.user._id;

	// Try and delete retweet
	const deletedPost = await Post.findOneAndDelete({
		postedBy: userId,
		retweetData: postId,
	}).catch((error) => {
		console.log(error);
		res.sendStatus(400);
	});
	console.log(deletedPost);

	const option = deletedPost != null ? "$pull" : "$addToSet";

	let repost = deletedPost;

	if (repost == null) {
		repost = await Post.create({ postedBy: userId, retweetData: postId }).catch(
			(error) => {
				console.log(error);
				res.sendStatus(400);
			}
		);
	}

	// Insert user like
	req.session.user = await User.findByIdAndUpdate(
		userId,
		{ [option]: { retweets: repost._id } },
		{ new: true }
	).catch((error) => {
		console.log(error);
		res.sendStatus(400);
	});

	// Insert post like
	const post = await Post.findByIdAndUpdate(
		postId,
		{ [option]: { retweetUsers: userId } },
		{ new: true }
	).catch((error) => {
		console.log(error);
		res.sendStatus(400);
	});

	res.status(200).send(post);
});

router.delete("/:id", (req, res, next) => {
	Post.findByIdAndDelete(req.params.id)
		.then(() => res.sendStatus(202))
		.catch((error) => {
			console.log(error);
			return res.sendStatus(400);
		});
});

router.put("/:id", async (req, res, next) => {
	if (req.body.pinned !== undefined) {
		await Post.updateMany(
			{ postedBy: req.session.user },
			{ pinned: false }
		).catch((error) => {
			console.log(error);
			return res.sendStatus(400);
		});
	}

	Post.findByIdAndUpdate(req.params.id, req.body)
		.then(() => res.sendStatus(204))
		.catch((error) => {
			console.log(error);
			return res.sendStatus(400);
		});
});

async function getPosts(filter) {
	let result = await Post.find(filter)
		.populate("postedBy")
		.populate("retweetData")
		.populate("replyTo")
		.sort({ createdAt: -1 })
		.catch((error) => console.log(error));

	result = await User.populate(result, { path: "replyTo.postedBy" });
	result = await User.populate(result, { path: "retweetData.postedBy" });
	return result;
}

module.exports = router;
