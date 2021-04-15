// class Home {
// 	constructor() {
// 		this.postsContainer = document.querySelector(".postsContainer");
// 		this.getposts();
// 	}
const postsContainer = document.querySelector(".postsContainer");

window.addEventListener("DOMContentLoaded", async () => {
	const results = await (await fetch("/api/posts")).json();
	this.outputPosts(results, postsContainer);
});
