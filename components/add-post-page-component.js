import {  onAddPostClick } from "../api.js"
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { goToPage } from "../index.js";
import { POSTS_PAGE } from "../routes.js";
import { safeInputText } from "../helpers.js";
import Swal from 'sweetalert2'

export function renderAddPostPageComponent({ appEl, token }) {
  let userImageUrl =''

  const render = () => {
    const appHtml = `<div class="page-container">
    <div class="header-container"></div>
    <div class="form">
      <h3 class="form-title">Добавить пост</h3>
      <div class="form-inputs">
        <div class="upload-image-container">
<div class="upload=image">
    
          <label class="file-upload-label secondary-button">
              <input type="file" class="file-upload-input" style="display:none">
              Выберите фото
          </label>
</div>
</div>
        <label>
          Опишите фотографию:
          <textarea class="input textarea" rows="4"></textarea>
          </label>
          <button  class="button" id="add-button">Добавить</button>
      </div>
    </div>
  </div>
  `;
    
    appEl.innerHTML = appHtml;
    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange: (newImageUrl) => userImageUrl = newImageUrl
    })
   
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    document.getElementById("add-button").addEventListener("click", async () => {
      if (!document.querySelector('.textarea').value) {
        Swal.fire('Добавьте описание фото ')
        return;
      }
      if (!userImageUrl) {
        Swal.fire('А где фото? ')
        return;
      }
    
    
      onAddPostClick({
        
        description: safeInputText(document.querySelector('.textarea').value),
        imageUrl:  userImageUrl,
        token: token,
      })
      .then(() => goToPage(POSTS_PAGE))
     
    });
  };

  
  render();
}
