import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const loadMoreBtnEl = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a');

let pageNumber = 1;

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

    const response = await axios.get('https://pixabay.com/api', requestConfig);

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const renderImages = images => {
  const photoCardsMarkup = images.map(({ webformatURL, likes, views, comments, downloads, largeImageURL }) => {
    return `
      <a href="${largeImageURL}" class="gallery__item">
        <img src="${webformatURL}" alt="" loading="lazy" class="gallery__image" />
        <div class="info">
          <p class="info-item"><b>Likes</b>${likes}</p>
          <p class="info-item"><b>Views</b>${views}</p>
          <p class="info-item"><b>Comments</b>${comments}</p>
          <p class="info-item"><b>Downloads</b>${downloads}</p>
        </div>
      </a>
    `;
  });

  galleryEl.insertAdjacentHTML('beforeend', photoCardsMarkup.join(''));
  lightbox.refresh();
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
    galleryEl.innerHTML = '';
    renderImages(hits);
    Notiflix.Notify.success(`Found ${totalHits} images`);
    pageNumber += 1;
    loadMoreBtnEl.disabled = false;
  } catch (error) {
    Notiflix.Notify.failure('Oops, something went wrong! Please try again later.');
  }
};

const handleLoadMoreBtnClick = async () => {
  const formData = new FormData(formEl);
  const searchQuery = formData.get('searchQuery').trim();

  try {
    const { hits } = await fetchImage(searchQuery, pageNumber);
    renderImages(hits);
    pageNumber += 1;
  } catch (error) {
    Notiflix.Notify.failure('Oops, something went wrong! Please try again later.');
  }
};

formEl.addEventListener('submit', handleFormSubmit);
loadMoreBtnEl.addEventListener('click', handleLoadMoreBtnClick);


// // Вибираємо всі картки зображень та обгортаємо їх у посилання
// const imageLinks = document.querySelectorAll('.image-card a');

// // Створюємо групу карток зображень та додаємо її до бібліотеки
// const imageGroup = [];
// imageLinks.forEach(link => {
//   imageGroup.push(link);
// });
// const lightbox = new SimpleLightbox(imageGroup);

// // Викликаємо метод refresh() щоразу після додавання нової групи карток зображень
// lightbox.refresh();


console.log(formEl);