document.addEventListener("DOMContentLoaded", () => {
	if (selectedTab === "replies") {
		loadPosts("true");
	} else {
		loadPosts("false");
	}
});

const postsContainer = document.querySelector(".postsContainer");
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
