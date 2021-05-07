document.addEventListener("DOMContentLoaded", () => {
	if (selectedTab === "followers") {
		loadFollow("followers");
	} else {
		loadFollow("following");
	}
});

const resultsContainer = document.querySelector(".resultsContainer");

async function loadFollow(follow) {
	const results = await (
		await fetch(`/api/users/${profileUserId}/${follow}`)
	).json();
	outputUsers(results[follow], resultsContainer);
}
