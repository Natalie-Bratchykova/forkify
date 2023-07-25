import View from './View.js';
// import icons from 'url:../../img/icons.svg';
class bookMarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');

  _errorMessage = `No bookmarks saved! Save something to find it here:)`;
  _message = '';

  _generateMarkup() {
    const activeId = window.location.hash.slice(1);
    return this._data
      .map(li => {
        return ` <li class="preview">
        <a class="preview__link ${
          li.id === activeId ? 'preview__link--active' : ''
        }" href="#${li.id}">
          <figure class="preview__fig">
            <img src="${li.image}" alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${li.title}</h4>
            <p class="preview__publisher">${li.publisher}</p>
            
          </div>
        </a>
      </li>`;
      })
      .join(' ');
  }

  addHandlerBookmarksRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new bookMarkView();

/*
for user own recipes 
<div class="preview__user-generated">
    <svg>
          <use href="${icons}#icon-user"></use>
    </svg>
</div> */
