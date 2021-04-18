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

	// await fetch(
	//   "/api/posts?" +
	//     new URLSearchParams({
	//       postedBy: profileUserId,
	//       isReply: flag,
	//     })
	// )
	outputUsers(results[follow], resultsContainer);
}

function outputUsers(results, container) {
	container.innerHTML = "";

	results.forEach((result) => {
		const html = createUserHtml(result, true);
		container.appendChild(html);
	});

	if (results.length == 0) {
		container.innerHTML = "<span class='noResults'>No results found</span>";
	}
}

function createUserHtml(userData, showFollowButton) {
	const { firstName, lastName, username, profilePic } = userData;
	const name = firstName + " " + lastName;
	const isFollowing =
		userLoggedIn.following && userLoggedIn.following.includes(userData._id);
	const text = isFollowing ? "Following" : "Follow";
	const buttonClass = isFollowing ? "followButton following" : "followButton";

	let followButton = "";
	if (showFollowButton && userLoggedIn._id != userData._id) {
		followButton = `
    <div class='followButtonContainer'>
      <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
    </div>
    `;
	}

	const div = document.createElement("div");
	div.classList.add = "user";
	div.innerHTML = `
  <div class='user'>
    <div class='userImageContainer'>
      <img src='${profilePic}'>
    </div>
    <div class='userDetailsContainer'>
      <div class='header'>
        <a href='/profile/${username}'>${name}</a>
        <span class='username'>@${username}</span>
      </div>
    </div>
    ${followButton}
  </div>`;

	return div;
}
