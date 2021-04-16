const postsContainer = document.querySelector(".postsContainer");

window.addEventListener("DOMContentLoaded", async () => {
	const results = await (await fetch(`/api/posts/${postId}`)).json();
	outputPostsWithReplies(results, postsContainer);
});
