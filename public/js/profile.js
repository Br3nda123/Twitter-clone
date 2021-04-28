document.addEventListener("DOMContentLoaded", () => {
	if (selectedTab === "replies") {
		loadPosts(true);
	} else {
		loadPosts(false);
	}
});

const postsContainer = document.querySelector(".postsContainer");
const pinnedPostContainer = document.querySelector(".pinnedPostContainer");
// $(document).ready(() => {
// 	loadPosts();
// });
// function loadPosts() {
// 	$.get("/api/posts", { postedBy: profileUserId, isReply: false }, (result) => {
// 		outputPosts(result, postsContainer);
// 		// console.log($(".postsContainer"));
// 	});
// }
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
	// const filteredResultsByUser = results.filter((result) => {
	// 	return result.postedBy._id == profileUserId;
	// });
	// outputPosts(filteredResultsByUser, postsContainer);
	outputPosts(results, postsContainer);
}

function outputPinnedPost(results, container) {
	if (results.length == 0) {
		// container.style.display = "none";
		container.style.visibility = "hidden";
		// container.hide();
		return;
	}
	container.innerHTML = "";

	results.forEach((result) => {
		const html = createPostHtml(result);
		container.appendChild(html);
	});
}
