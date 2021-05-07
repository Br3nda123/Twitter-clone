const sendButton = document.querySelector(".sendMessageButton");
const inputTextbox = document.querySelector(".inputTextbox");
let typing = false;
let lastTypingTime;

$(document).ready(() => {
	socket.emit("join room", chatId);
	socket.on("typing", () => {
		$(".typingDots").show();
		scrollToBottom(false);
	});
	socket.on("stop typing", () => $(".typingDots").hide());

	$.get(`/api/chats/${chatId}`, (data) =>
		$("#chatName").text(getChatName(data))
	);

	$.get(`/api/chats/${chatId}/messages`, (data) => {
		const messages = [];
		let lastSenderId = "";
		data.forEach((message, index) => {
			const html = createMessageHtml(message, data[index + 1], lastSenderId);
			messages.push(html);

			lastSenderId = message.sender._id;
		});

		const messagesHtml = messages.join("");
		addMessageHtmlToPage(messagesHtml);
		scrollToBottom(false);
		markAllMessageAsRead();

		$(".loadingSpinnerContainer").remove();
		$(".chatContainer").css("visibility", "visible");

		// messages.forEach((message) => {
		// 	addMessageHtmlToPage(message);
		// });
	});
});

$("#chatNameButton").click(() => {
	const chatName = $("#chatNameTextbox").val().trim();

	$.ajax({
		url: "/api/chats/" + chatId,
		type: "PUT",
		data: { chatName },
		success: (data, status, xhr) => {
			if (xhr.status != 204) {
				alert("could not update");
			} else {
				location.reload();
			}
		},
	});
});

function addMessageHtmlToPage(html) {
	// document.querySelector(".chatMessages").appendChild(html);

	document.querySelector(".chatMessages").innerHTML += html;
}

function messageSubmitted() {
	const content = inputTextbox.value.trim();

	if (content !== "") {
		sendMessage(content);
		inputTextbox.value = "";
		socket.emit("stop typing", chatId);
		typing = false;
	}
}

async function sendMessage(content) {
	const response = await fetch(
		"/api/messages?" +
			new URLSearchParams({
				content,
				chatId,
			}),
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		}
	);
	if (response.status != 201) {
		alert("Could not send message");
		inputTextbox.value = content;
		return;
	}
	const data = await response.json();
	addChatMessageHtml(data);

	if (connected) {
		socket.emit("new message", data);
	}
}

function addChatMessageHtml(message) {
	if (!message || !message._id) alert("Message is not valid");

	const messageDiv = createMessageHtml(message, null, "");

	addMessageHtmlToPage(messageDiv);
	scrollToBottom(true);
}

function createMessageHtml(message, nextMessage, lastSenderId) {
	const sender = message.sender;
	const senderName = sender.firstName + " " + sender.lastName;
	const currentSenderId = sender._id;
	const nextSenderId = nextMessage != null ? nextMessage.sender._id : "";

	const isFirst = lastSenderId != currentSenderId;
	const isLast = nextSenderId != currentSenderId;

	const isMine = message.sender._id == userLoggedIn._id;
	let liClassName = isMine ? "mine" : "theirs";

	let nameElement = "";
	if (isFirst) {
		liClassName += " first";

		if (!isMine) {
			nameElement = `<span class='senderName'>${senderName}</span>`;
		}
	}

	let profilePic = "";
	if (isLast) {
		liClassName += " last";
		profilePic = `<img src="${sender.profilePic}" alt='User's profile picture'></img>`;
	}

	let imgContainer = "";

	if (!isMine) {
		imgContainer = `
			<div class='imageContainer'>
				${profilePic}
			</div>
		`;
	}

	// const listItem = document.createElement("li");

	// listItem.classList.add("message", `${liClassName}`);
	// listItem.innerHTML = `
	// <div class='messageContainer'>
	// 	<span class='messageBody'>
	// 		${message.content}
	// 	</span>
	// </div>
	// `;

	// return listItem;

	return `<li class='message ${liClassName}'>
	${imgContainer}
	<div class='messageContainer'>
		${nameElement}
		<span class='messageBody'>
			${message.content}
		</span>
	</div>
	</li>`;
}

function scrollToBottom(animated) {
	const chatContainer = $(".chatMessages");
	const scrollHeight = chatContainer[0].scrollHeight;
	if (animated) {
		chatContainer.animate({ scrollTop: scrollHeight }, "slow");
		// chatContainer.getAnimations({ scrollTop: scrollHeight });
	} else {
		chatContainer.scrollTop(scrollHeight);
	}
}

function updateTyping() {
	if (!connected) return;

	if (!typing) {
		typing = true;
		socket.emit("typing", chatId);
	}
	lastTypingTime = new Date().getTime();
	let timerLength = 3000;
	setTimeout(() => {
		const timeNow = new Date().getTime();
		const timeDiff = timeNow - lastTypingTime;

		if (timeDiff >= timerLength && typing) {
			socket.emit("stop typing", chatId);
			typing = false;
		}
	}, timerLength);
}

sendButton.addEventListener("click", messageSubmitted);
inputTextbox.addEventListener("keypress", (event) => {
	updateTyping();

	if ((event.keyCode == 13 || event.which == 13) && !event.shiftKey) {
		event.preventDefault();
		messageSubmitted();
	}
});

function markAllMessageAsRead() {
	$.ajax({
		url: `/api/chats/${chatId}/messages/markAsRead`,
		type: "PUT",
		success: refreshMessagesBadge,
	});
}
