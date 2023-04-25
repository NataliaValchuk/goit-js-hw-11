import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';

const formEl = document.querySelector('.search-form');
const loadMoreBtnEl = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a');

let pageNumber = 1;
let hitsCounter = 0;

const showLoadMoreBtn = () => {
  loadMoreBtnEl.classList.remove('hidden');
};

const hideLoadMoreBtn = () => {
  loadMoreBtnEl.classList.add('hidden');
};

const handleNoImages = () => {
  hideLoadMoreBtn();

  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
};

const updateHitsCounter = (hits, total) => {
  const hitsLength = hits.length;

  hitsCounter += hitsLength;

  if (!hitsLength) {
    handleNoImages();
    return;
  }

  if (hitsCounter === total) {
    hideLoadMoreBtn();
    return;
  }

  showLoadMoreBtn();
};

const renderImages = images => {
  const photoCardsMarkup = images.map(
    ({ webformatURL, likes, views, comments, downloads, largeImageURL }) => {
      return `
      <a href="${largeImageURL}" class="photo-card">
        <img src="${webformatURL}" alt="" loading="lazy" class="photo-card__image" />
        <div class="info">
          <p class="info__item"><b>Likes</b>${likes}</p>
          <p class="info__item"><b>Views</b>${views}</p>
          <p class="info__item"><b>Comments</b>${comments}</p>
          <p class="info__item"><b>Downloads</b>${downloads}</p>
        </div>
      </a>
    `;
    }
  );

  galleryEl.insertAdjacentHTML('beforeend', photoCardsMarkup.join(''));
  lightbox.refresh();
};

const increasePageNumber = () => {
  pageNumber += 1;
};

const clearGallery = () => {
  galleryEl.innerHTML = '';
};

const resetPageNumber = () => {
  pageNumber = 1;
};

const resetHitsCounter = () => {
  hitsCounter = 0;
};

const reset = () => {
  clearGallery();
  resetPageNumber();
  resetHitsCounter();
  hideLoadMoreBtn();
};

const disableLoadMoreBtn = () => {
  loadMoreBtnEl.disabled = true;
};

const enableLoadMoreBtn = () => {
  loadMoreBtnEl.disabled = false;
};

const fetchData = async searchKeyWord => {
  try {
    disableLoadMoreBtn();

    const { data } = await fetchImages(searchKeyWord, pageNumber);
    const { hits, totalHits } = data;

    updateHitsCounter(hits, totalHits);

    if (!hits.length) {
      return;
    }

    renderImages(hits);
    increasePageNumber();
    enableLoadMoreBtn();

    return data;
  } catch (error) {
    Notiflix.Notify.failure(
      error.status === 404
        ? 'Oops, something went wrong! Please try again later.'
        : error.message
    );

    reset();
  }
};

const handleFormSubmit = async event => {
  event.preventDefault();

  reset();

  const formData = new FormData(event.currentTarget);
  const searchQuery = formData.get('searchQuery').trim();

  if (!searchQuery) {
    Notiflix.Notify.warning('Please enter a search keyword!');

    return;
  }

  const { totalHits } = await fetchData(searchQuery);

  Notiflix.Notify.success(`Found ${totalHits} images`);
};

const handleLoadMoreBtnClick = async () => {
  const formData = new FormData(formEl);
  const searchQuery = formData.get('searchQuery').trim();

  await fetchData(searchQuery);
};

formEl.addEventListener('submit', handleFormSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);

