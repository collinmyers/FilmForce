import axios from 'axios';

const url = "https://api.themoviedb.org/3";
const api_key = "?api_key=ab1e98b02987e9593b705864efaf4798";

export const getTopMovies = async () => {
  try {
    const response = await axios.get(`${url}/discover/movie${api_key}`);
    const responseData = response.data; // Access the response data directly

    // Access the first result
    const firstMovie = responseData.results[0];

    if (firstMovie) {
      console.log("First Movie Title:", firstMovie.title);
      console.log("First Movie Overview:", firstMovie.overview);
    } else {
      console.log("No results found.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

getTopMovies();
