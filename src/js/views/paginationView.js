import View from './View.js';
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _errorMessage = `We could not find this recipe. Please, try another one!`;
  _message = '';

  _generateMarkup() {
    const pagesNumber = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    if (pagesNumber - 1 === 0) {
      return '';
    } else if (pagesNumber > 1 && Number(this._data.currentPage) === 1) {
      return this._generateNextPageBtnMarkup(+this._data.currentPage + 1);
    } else if (Number(this._data.currentPage) === pagesNumber) {
      return this._generatePrevPageBtnMarkup(+this._data.currentPage - 1);
    } else {
      return (
        this._generatePrevPageBtnMarkup(+this._data.currentPage - 1) +
        this._generateNextPageBtnMarkup(+this._data.currentPage + 1)
      );
    }
  }

  _generatePrevPageBtnMarkup(number) {
    return `
    <button class="btn--inline pagination__btn--prev" data-moveto ="${number}">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${number}</span>
  </button>`;
  }
  _generateNextPageBtnMarkup(number) {
    return `
    <button class="btn--inline pagination__btn--next" data-moveto ="${number}" >
        <span>Page ${number}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
          `;
  }

  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      console.log(btn.dataset.moveto);
      handler(btn.dataset.moveto);
    });
  }
}

export default new PaginationView();
