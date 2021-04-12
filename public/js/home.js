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

function outputPosts(results, container) {
	container.innerHTML = "";

	results.forEach((result) => {
		const html = createPostHtml(result);
		container.appendChild(html);
	});

	if (results.length == 0) {
		container.appendChild("<span class='noResult'>Nothing to show.</span>");
	}
}
