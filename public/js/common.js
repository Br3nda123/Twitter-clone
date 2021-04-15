const submitButtons = [
	document.querySelector("#submitPostButton"),
	document.querySelector("#submitReplyButton"),
];
const textAreas = [
	document.querySelector("#postTextarea"),
	document.querySelector("#replyTextarea"),
];
textAreas.forEach((textarea) => {
	textarea.addEventListener("keyup", (e) => {
		const textbox = e.target;
		const value = textbox.value.trim();

		const isModal = !!(textbox.closest(".modal") === null);
		// const isModal = textbox.parents(".modal").length == 1;
		const submitButton = isModal ? submitButtons[0] : submitButtons[1];

		if (submitButton.lenght == 0) return alert("No submit button found");

		if (value == "") {
			submitButton.setAttribute("disabled", true);
			return;
		}
		submitButton.removeAttribute("disabled");
	});
});

// async function posts(url, data = {}) {
// 	const response = await fetch(url, {
// 		method: "POST", // *GET, POST, PUT, DELETE, etc.
// 		mode: "cors", // no-cors, *cors, same-origin
// 		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
// 		credentials: "same-origin", // include, *same-origin, omit
// 		headers: {
// 			"Content-Type": "application/json",
// 			// 'Content-Type': 'application/x-www-form-urlencoded',
// 		},
// 		redirect: "follow", // manual, *follow, error
// 		referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
// 		body: JSON.stringify(data), // body data type must match "Content-Type" header
// 	});
// 	return response.json();
// }

submitButtons.forEach((submit) => {
	submit.addEventListener("click", (e) => {
		const button = event.target;

		const isModal = !(button.closest(".modal") === null);
		const textArea = isModal ? textAreas[1] : textAreas[0];

		const data = {
			content: textArea.value,
		};

		if (isModal) {
			const id = button.dataset.id;
			if (id == null) return alert("Button id is null");
			data.replyTo = id;
		}

		// fetch("/api/posts", {
		// 	method: "POST", // *GET, POST, PUT, DELETE, etc.
		// 	//body: JSON.stringify(data), // body data type must match "Content-Type" header
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: {
		// 		data: "aaaaaa",
		// 		lala: "assadsadsad",
		// 	},
		// })
		// 	.then((resp) => resp.json())
		// 	.then((resp) => console.log(resp));

		// const response = await posts("/api/posts", data);
		// console.log(response);

		$.post("/api/posts", data, (postData, status, xhr) => {
			if (postData.replyTo) {
				location.reload();
			} else {
				const html = createPostHtml(postData);
				document.querySelector(".postsContainer").prepend(html);
				textArea.value = "";
				button.setAttribute("disabled", true);
			}
		});
	});
});

$("#replyModal").on("show.bs.modal", async (event) => {
	const button = event.relatedTarget;
	const postId = getPostIdFromElement(button);
	submitButtons[1].dataset.id = postId;

	const result = await (await fetch(`/api/posts/${postId}`)).json();
	outputPosts(result, document.getElementById("originalPostContainer"));
});

$("#replyModal").on(
	"hidden.bs.modal",
	() => (document.getElementById("originalPostContainer").innerHTML = "")
);

function likeButtonFn(e) {
	const button = e.target;
	const postId = getPostIdFromElement(button);

	if (postId === undefined) return;

	fetch(`/api/posts/${postId}/like`, {
		method: "PUT",
		headers: {
			"Content-type": "application/json",
		},
	})
		.then((resp) => resp.json())
		.then((data) => {
			button.querySelector("span").textContent = data.likes.length || "";

			if (data.likes.includes(userLoggedIn._id)) {
				button.classList.add("active");
			} else {
				button.classList.remove("active");
			}
		})
		.catch((err) => console.log(err));

	// $.ajax({
	// 	url: `/api/posts/${postId}/like`,
	// 	type: "PUT",
	// 	success: (postData) => {
	// 		button.find("span").text(postData.likes.length || "");
	// 	},
	// });
}

// $(document).on("click", ".likeButton", (e) => {
// 	const button = $(e.target);
// 	console.log(button);
// });

function retweetButtonFn(e) {
	const button = e.target;
	const postId = getPostIdFromElement(button);

	if (postId === undefined) return;

	fetch(`/api/posts/${postId}/retweet`, {
		method: "POST",
		headers: {
			"Content-type": "application/json", // Indicates the content
		},
		// body: JSON.stringify(someData),
	})
		.then((resp) => resp.json())
		// .then((resp) => resp.text())
		.then((data) => {
			button.querySelector("span").textContent = data.retweetUsers.length || "";
			if (data.retweetUsers.includes(userLoggedIn._id)) {
				button.classList.add("active");
			} else {
				button.classList.remove("active");
			}
		})
		.catch((err) => console.log(err));

	// $.ajax({
	// 	url: `/api/posts/${postId}/retweet`,
	// 	type: "POST",
	// 	success: (postData) => {
	// 		button.find("span").text(postData.likes.length || "");
	// 	},
	// });
}

const getPostIdFromElement = (element) => {
	const isRoot = element.classList === "post";
	const rootElement = isRoot ? element : element.closest(".post");
	const postId = rootElement.dataset.id;

	if (postId === undefined) return alert("Post id undefined");

	return postId;
};

function createPostHtml(postData) {
	if (postData == null) return alert("Post object is null");

	const isRetweet = postData.retweetData != undefined;
	const retweetedBy = isRetweet ? postData.postedBy.username : null;
	postData = isRetweet ? postData.retweetData : postData;

	const postedBy = postData.postedBy;

	if (postedBy._id === undefined) {
		return console.log("User object not populated");
	}

	const displayName = postedBy.firstName + " " + postedBy.lastName;
	const timestamp = timeDifference(new Date(), new Date(postData.createdAt));

	const likeButtonActiveClass = postData.likes.includes(userLoggedIn._id)
		? "active"
		: "";
	const retweetButtonActiveClass = postData.retweetUsers.includes(
		userLoggedIn._id
	)
		? "active"
		: "";

	let retweetText = "";
	if (isRetweet) {
		retweetText = `
		<span>
			<i class="fas fa-retweet"></i>
			Retweeted by <a href='/profile/${retweetedBy}'>@${retweetedBy}</a>
		</span>`;
	}

	let replyFlag = "";
	if (postData.replyTo) {
		if (!postData.replyTo._id) {
			return alert("Reply to is not populated");
		} else if (!postData.replyTo.postedBy._id) {
			return alert("postedBy to is not populated");
		}

		const replyToUsername = postData.replyTo.postedBy.username;
		replyFlag = `
		<div class='replyFlag'>
			Replying to <a href='/profile/${replyToUsername}'>@${replyToUsername}</a>
		</div>`;
	}

	const div = document.createElement("div");
	div.className = "post";
	div.setAttribute("data-id", postData._id);
	div.innerHTML = `
			<div class='postActionContainer'>
				${retweetText}
			</div>
      <div class='mainContentContainer'>
        <div class='userImageContainer'>
          <img src='${postedBy.profilePic}'>
        </div>
        <div class='postContentContainer'>
          <div class='header'>
            <a href='/profile/${
							postedBy.username
						}' class="displayName">${displayName}</a>
            <span class='username'>@${postedBy.username}</span>
            <span class='date'>${timestamp}</span>
          </div>
					${replyFlag}
          <div class='postBody'>
            <span>${postData.content}</span>
          </div>
          <div class='postFooter'>
            <div class="postButtonContainer">
              <button type="button" data-toggle="modal" data-target="#replyModal">
                <i class="far fa-comment"></i>
              </button>
            </div>
            <div class="postButtonContainer green">
              <button class="retweetButton ${retweetButtonActiveClass}" onclick="retweetButtonFn(event)">
                <i class="fas fa-retweet"></i>
								<span>${postData.retweetUsers.length || ""}</span>
              </button>
            </div>
            <div class="postButtonContainer red">
              <button class="likeButton ${likeButtonActiveClass}" onclick="likeButtonFn(event)">
                <i class="far fa-heart"></i>
								<span>${postData.likes.length || ""}</span>
              </button>
            </div>
          </div>
        </div>
      </div>`;

	return div;
}

function timeDifference(current, previous) {
	const msPerMinute = 60 * 1000;
	const msPerHour = msPerMinute * 60;
	const msPerDay = msPerHour * 24;
	const msPerMonth = msPerDay * 30;
	const msPerYear = msPerDay * 365;

	const elapsed = current - previous;

	if (elapsed < msPerMinute) {
		if (elapsed / 1000 < 30) return "Just now";
		return Math.round(elapsed / 1000) + " seconds ago";
	} else if (elapsed < msPerHour) {
		return Math.round(elapsed / msPerMinute) + " minutes ago";
	} else if (elapsed < msPerDay) {
		return Math.round(elapsed / msPerHour) + " hours ago";
	} else if (elapsed < msPerMonth) {
		return Math.round(elapsed / msPerDay) + " days ago";
	} else if (elapsed < msPerYear) {
		return "over " + Math.round(elapsed / msPerMonth) + " months ago";
	} else {
		return "over " + Math.round(elapsed / msPerYear) + " years ago";
	}
}

// $("#postTextarea").keyup((event) => {
// 	const textbox = $(event.target);
// 	const value = textbox.val().trim();

// 	const submitButton = $("#submitPostButton");

// 	if (value == "") {
// 		submitButton.prop("disabled", true);
// 		console.log(submitButton);
// 		return;
// 	}

// 	submitButton.prop("disabled", false);
// });

function outputPosts(results, container) {
	container.innerHTML = "";
	if (!Array.isArray(results)) results = [results];

	results.forEach((result) => {
		const html = createPostHtml(result);
		container.appendChild(html);
	});

	if (results.length == 0) {
		container.appendChild("<span class='noResult'>Nothing to show.</span>");
	}
}
