import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const loadMoreBtnEl = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a');

let pageNumber = 1;

const showLoadMoreBtn = () => {
  loadMoreBtnEl.classList.remove('hidden');
};

const hideLoadMoreBtn = () => {
  loadMoreBtnEl.classList.add('hidden');
};

const fetchImage = async (searchKeyWord, page) => {
  try {
    const requestConfig = {
      params: {
        key: '35609739-281e68efedb9f0ad474261401',
        q: searchKeyWord,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
      },
    };

    const response = await axios.get('https://pixabay.com/api/', requestConfig);

    return response.data;
  } catch (error) {
    console.log(error);
  }
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

const showErrorNotification = () =>
  Notiflix.Notify.failure(
    'Oops, something went wrong! Please try again later.'
  );

const handleNoImages = () => {
  hideLoadMoreBtn();

  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
};

const clearGallery = () => {
  galleryEl.innerHTML = '';
};

const increasePageNumber = () => {
  pageNumber += 1;
};

const handleFormSubmit = async event => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const searchQuery = formData.get('searchQuery').trim();

  if (!searchQuery) {
    Notiflix.Notify.warning('Please enter a search keyword!');

    return;
  }

  try {
    const { hits, totalHits } = await fetchImage(searchQuery, pageNumber);

    clearGallery();
    renderImages(hits);

    console.log(hits.length, hits);

    if (!hits.length) {
      handleNoImages();

      return;
    }

    Notiflix.Notify.success(`Found ${totalHits} images`);

    showLoadMoreBtn();
    increasePageNumber();
  } catch (error) {
    showErrorNotification();
  }
};

const handleLoadMoreBtnClick = async () => {
  const formData = new FormData(formEl);
  const searchQuery = formData.get('searchQuery').trim();

  try {
    const { hits } = await fetchImage(searchQuery, pageNumber);

    renderImages(hits);
    increasePageNumber();
  } catch (error) {
    showErrorNotification();
  }
};

formEl.addEventListener('submit', handleFormSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);


