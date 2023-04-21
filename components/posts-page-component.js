import { USER_POSTS_PAGE,} from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken } from "../index.js";
import { user } from "../index.js";
import { addLike } from "../api.js";
import { delLike } from "../api.js";
import { deletePost } from "../api.js";
import { POSTS_PAGE } from "../routes.js";

export function renderPostsPageComponent({ appEl }) {

  const appHtml = `<div class="page-container">
  <div class="header-container"></div>
  <ul class="posts">` +

  posts.map((post, id) => {
    return  `
    <li class="post" data-index = "${id}">

      <div class="post-header" data-user-id=${post.user.id}
      <div class="post-header-user"><img src=${post.user.imageUrl} class="post-header__user-image">
      <p class="post-header__user-name">${post.user.name}</p>
      </div>
      

      <div class="post-image-container">
        <img class="post-image" src=${post.imageUrl}>
      </div>
      <div class="post-likes">
        <button data-post-id=${post.id} class="like-button">
          <img src="./assets/images/${post.isLiked ? 'like-active.svg' : 'like-not-active.svg'}">
        </button>
        <p class="post-likes-text">
            Нравится: <strong>
             ${post.likes.length > 1 ? post.likes[0].name + ` и ещё ${post.likes.length - 1}`
            : post.likes.length ? post.likes[0].name
              : "0"}</strong>
        </p>
      </div>
      <p class="post-text">
        <span class="user-name">${post.user.name}</span>
        ${post.description}
      </p>
      <button class="del__comment" data-post-id="${post.id}">Удалить пост</button>
      <p class="post-date">${post.createdAt}</p>
      
    </li>
  `
  }).join('') +

  `</ul>
</div>`;

appEl.innerHTML = appHtml;

renderHeaderComponent({
  element: document.querySelector(".header-container"),
});

for (let userEl of document.querySelectorAll(".post-header")) {
  userEl.addEventListener("click", () => {
    goToPage(USER_POSTS_PAGE, {
      userId: userEl.dataset.userId,
    });
  });
}




document.querySelectorAll(".del__comment").forEach((delEl) => {
  delEl.addEventListener("click", () => {
    if (!user) {
      alert('удалать посты могут только авторизованные пользователи')
        return;
      }
    const postId = delEl.dataset.postId
    console.log(postId)
   
    deletePost({
      token : getToken(),
      id : delEl.dataset.postId,
    }).then(() => {
      goToPage(POSTS_PAGE);
  })
    
  });
});





// Лайки
document.querySelectorAll(".like-button").forEach((likeEl) => {
  likeEl.addEventListener("click", () => {
    handleLikeClick(likeEl)
  });
});

// логика лайков
function handleLikeClick (likeEl){
  const postId = likeEl.dataset.postId;

  const index = likeEl.closest(".post").dataset.index;
 
  const post = posts[index];
    if (!user) {
    alert('лайки ставить могут только авторизованные пользователи')
      return;
    }
  const isLiked = posts[index].isLiked;


  if (!isLiked){
    addLike({
      token : getToken(),
      postId : postId,
    }).then(() => {
      post.isLiked = true;
      post.likes.push({
        id: user.id,
        name: user.name,
      });
      renderPostsPageComponent({ appEl });
    });
  } else if (isLiked) {           
    delLike({
      token: getToken(),
      postId: postId,
    }).then(() => {
      post.isLiked = false;
      post.likes.pop();
      renderPostsPageComponent({ appEl });
    });
  }
}

}