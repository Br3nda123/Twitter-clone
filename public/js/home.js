const postsContainer = document.querySelector(".postsContainer");

window.addEventListener("DOMContentLoaded", async () => {
	const results = await (
		await fetch(
			"/api/posts?" +
				new URLSearchParams({
					followingOnly: true,
				})
		)
	).json();
	this.outputPosts(results, postsContainer);
});
