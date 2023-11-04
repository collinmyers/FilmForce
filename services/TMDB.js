import axios from 'axios';

const url = "https://api.themoviedb.org/3";
const api_key = "?api_key=ab1e98b02987e9593b705864efaf4798";

export const getTopMovies = async () => {
  try {
    const response = await axios.get(`${url}/discover/movie${api_key}`);
    const responseData = response.data; // Access the response data directly
    const moviesArray = responseData.results;

    moviesArray.forEach((movie, index) => {
        console.log(`Movie ${index + 1} - Title: ${movie.title}`);
      });
      return moviesArray;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

getTopMovies();
