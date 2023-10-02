import axios from "axios";

const API_KEY = '39697085-f98d9d9a00fbf9834f0a233e6';
const BASE_URL = 'https://pixabay.com/api/';

export async function getImages (value, page = 1, perPage = 40) {
    try {
    const result = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
      );
    return result;
    //console.log(result)
  
    } catch (error) {
      console.log(error)
    } 
  }
  