const resultsContainer = document.querySelector(".resultsContainer");
document.addEventListener("DOMContentLoaded", async () => {
	try {
		const chatResponse = await (await fetch("/api/chats")).json();
		outputChatList(chatResponse, resultsContainer);
	} catch {
		alert("Could not get chat list");
	}
});

function outputChatList(chatList, container) {
	chatList.forEach((chat) => {
		const html = createChatHtml(chat);
		container.appendChild(html);
	});

	if (chatList.length == 0) {
		container.innerHTML = `<span class='noResults'>Nothing to show.</span>`;
	}
}

function createChatHtml(chatData) {
	const chatName = getChatName(chatData);
	const image = getChatImageElements(chatData);
	const latestMessage = "This is the latest message";

	const a = document.createElement("a");
	a.classList.add("resultListItem");
	a.setAttribute("href", `/messages/${chatData._id}`);
	a.innerHTML = `
    ${image}
    <div class='resultsDetailtContainer ellipsis'>
      <span class='heading ellipsis'>${chatName}</span>
      <span class='subText ellipsis'>${latestMessage}</span>
    </div>`;

	return a;
}

function getChatName(chatData) {
	let chatName = chatData.chatName;

	if (!chatName) {
		const otherChatUsers = getOtherChatUsers(chatData.users);

		const namesArray = otherChatUsers.map(
			(user) => user.firstName + " " + user.lastName
		);

		chatName = namesArray.join(", ");
	}

	return chatName;
}

function getOtherChatUsers(users) {
	if (users.length == 1) return users;

	return users.filter((user) => user._id != userLoggedIn._id);
}

function getChatImageElements(chatData) {
	const otherChatUsers = getOtherChatUsers(chatData.users);

	let groupChatClass = "";
	let chatImage = getUserChatImageElement(otherChatUsers[0]);

	if (otherChatUsers.length > 1) {
		groupChatClass = "groupChatImage";
		chatImage += getUserChatImageElement(otherChatUsers[1]);
	}

	return `<div class='resultsImageContainer ${groupChatClass}'>${chatImage}</div>`;
}

function getUserChatImageElement(user) {
	if (!user || !user.profilePic) {
		return alert("User passed into function is invalid");
	}

	return `<img src='${user.profilePic}' alt='User's profile pic'>`;
}
