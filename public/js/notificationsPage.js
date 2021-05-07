document.addEventListener("DOMContentLoaded", async () => {
	const container = document.querySelector(".resultsContainer");
	const notification = await fetch("/api/notifications", {});
	const dataNotif = await notification.json();

	outputNotificationList(dataNotif, container);

	document
		.querySelector("#markNotificationsAsRead")
		.addEventListener("click", () => markNotificationsAsOpened());
});
