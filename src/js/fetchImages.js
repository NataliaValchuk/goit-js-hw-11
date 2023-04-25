import axios from 'axios';

export const fetchImages = async (searchKeyWord, page) => {  
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

    return axios.get('https://pixabay.com/api/', requestConfig);
};
   