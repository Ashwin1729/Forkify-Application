import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goto = +btn.dataset.goto;
      handler(goto);
    });
  }

  _nextButton(page) {
    return `
        <button data-goto="${
          page + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
  }

  _prevButton(page) {
    return `
        <button data-goto="${
          page - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page - 1}</span>
        </button>
      `;
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page 1 and other pages
    if (currPage === 1 && numPages > 1) {
      return this._nextButton(currPage);
    }
    // last page
    if (currPage === numPages && numPages > 1) {
      return this._prevButton(currPage);
    }
    // other page
    if (currPage < numPages) {
      return `
        ${this._prevButton(currPage)}
        ${this._nextButton(currPage)}
      `;
    }
    // Page 1 and no other pages
    return '';
  }
}

export default new PaginationView();
