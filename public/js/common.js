const submitButton = document.querySelector("#submitPostButton");
const textArea = document.querySelector("#postTextarea");
textArea.addEventListener("keyup", (e) => {
	const textbox = e.target;
	const value = textbox.value.trim();

	if (submitButton.lenght == 0) return alert("No submit button found");

	if (value == "") {
		submitButton.setAttribute("disabled", true);
		return;
	}
	submitButton.removeAttribute("disabled");
});

async function posts(url, data = {}) {
	const response = await fetch(url, {
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		mode: "cors", // no-cors, *cors, same-origin
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, *same-origin, omit
		headers: {
			"Content-Type": "application/json",
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		redirect: "follow", // manual, *follow, error
		referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		body: JSON.stringify(data), // body data type must match "Content-Type" header
	});
	return response.json();
}

submitButton.addEventListener("click", (e) => {
	const button = e.target;
	const data = {
		content: textArea.value,
	};

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
		const html = createPostHtml(postData);

		document.querySelector(".postsContainer").prepend(html);
		textArea.value = "";
		button.setAttribute("disabled", true);
	});
});

function createPostHtml(postData) {
	const postedBy = postData.postedBy;
	console.log(postedBy);
	const displayName = postedBy.firstName + " " + postedBy.lastName;
	const timestamp = postData.createdAt;

	const div = document.createElement("div");
	div.className = "post";
	div.innerHTML = `
    <div class='mainContentContainer'>
      <div class='userImageContainer'>
        <img src='${postedBy.profilePic}'>
      </div>
      <div class='postContentContainer'>
        <div class='header'>
					<a href='/profile/${postedBy.username}' class="displayName">${displayName}</a>
					<span class='username'>@${postedBy.username}</span>
					<span class='date'>${timestamp}</span>
        </div>
        <div class='postBody'>
          <span>${postData.content}</span>
        </div>
        <div class='postFooter'>
					<div class="postButtonContainer">
						<button>
							<i class="far fa-comment"></i>
						</button>
					</div>
					<div class="postButtonContainer">
						<button>
							<i class="fas fa-retweet"></i>
						</button>
					</div>
					<div class="postButtonContainer">
						<button>
							<i class="far fa-heart"></i>
						</button>
					</div>
        </div>
      </div>
    </div>`;
	console.log(div);

	return div;
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
