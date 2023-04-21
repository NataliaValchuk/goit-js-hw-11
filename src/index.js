import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// axios.get([перший аргумент], [другий аргумент]);

//     {
//       params: {
//         key: '35609739-281e68efedb9f0ad474261401',
//         q: searchKeyWord,
//         image_type: 'photo',
//         orientation: 'horizontal',
//         safesearch: true,
//       },
//     }

const fetchImage = async searchKeyWord => {
  try {
    const requestConfig = {
      params: {
        key: '35609739-281e68efedb9f0ad474261401',
        q: searchKeyWord,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    };

    const response = await axios.get('https://pixabay.com/api', requestConfig);

    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

fetchImage();
