// function createPostHtml(postData) {
// 	const postedBy = postData.postedBy;
// 	console.log(postedBy);
// 	const displayName = postedBy.firstName + " " + postedBy.lastName;
// 	const timestamp = postData.createdAt;

// 	const div = document.createElement("div");
// 	div.className = "post";
// 	div.innerHTML = `
//       <div class='mainContentContainer'>
//         <div class='userImageContainer'>
//           <img src='${postedBy.profilePic}'>
//         </div>
//         <div class='postContentContainer'>
//           <div class='header'>
//             <a href='/profile/${postedBy.username}' class="displayName">${displayName}</a>
//             <span class='username'>@${postedBy.username}</span>
//             <span class='date'>${timestamp}</span>
//           </div>
//           <div class='postBody'>
//             <span>${postData.content}</span>
//           </div>
//           <div class='postFooter'>
//             <div class="postButtonContainer">
//               <button>
//                 <i class="far fa-comment"></i>
//               </button>
//             </div>
//             <div class="postButtonContainer">
//               <button>
//                 <i class="fas fa-retweet"></i>
//               </button>
//             </div>
//             <div class="postButtonContainer">
//               <button>
//                 <i class="far fa-heart"></i>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>`;

// 	return div;
// }
