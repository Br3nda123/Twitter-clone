document.addEventListener("DOMContentLoaded", () => {
	if (selectedTab === "replies") {
		loadPosts(true);
	} else {
		loadPosts(false);
	}
});

const postsContainer = document.querySelector(".postsContainer");
const pinnedPostContainer = document.querySelector(".pinnedPostContainer");
async function loadPosts(flag) {
	if (flag == false) {
		const pinnedResults = await (
			await fetch(
				"/api/posts?" +
					new URLSearchParams({
						postedBy: profileUserId,
						pinned: true,
					})
			)
		).json();
		outputPinnedPost(pinnedResults, pinnedPostContainer);
	}

	const results = await (
		await fetch(
			"/api/posts?" +
				new URLSearchParams({
					postedBy: profileUserId,
					isReply: flag,
				})
		)
	).json();
	outputPosts(results, postsContainer);
}

function outputPinnedPost(results, container) {
	if (results.length == 0) {
		container.style.visibility = "hidden";
		return;
	}
	container.innerHTML = "";

	results.forEach((result) => {
		const html = createPostHtml(result);
		container.appendChild(html);
	});
}
