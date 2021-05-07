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
