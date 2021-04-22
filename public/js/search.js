const searchBox = document.querySelector("#searchBox");
const searchResultContainer = document.querySelector(".resultsContainer");

let timer;

searchBox.addEventListener("keyup", (event) => {
	clearTimeout(timer);

	const textBox = event.target;
	const textBoxValue = textBox.value;
	const searchType = textBox.dataset.search;

	timer = setTimeout(() => {
		const value = textBoxValue.trim();

		if (value == "") {
			searchResultContainer.innerHTML = "";
		} else {
			search(value, searchType);
		}
	}, 1000);

	// console.log(textBoxValue);
	// console.log(searchType);
});

function search(searchTerm, searchType) {
	const url = searchType == "users" ? "/api/users" : "/api/posts";

	$.get(url, { search: searchTerm }, (results) => {
		if (searchType == "users") {
			outputUsers(results, searchResultContainer);
		} else {
			outputPosts(results, searchResultContainer);
		}
	});
}
