import axios from 'axios';

const url = "https://api.themoviedb.org/3";
const api_key = "?api_key=ab1e98b02987e9593b705864efaf4798";


// Gets top movies from TMDB
export const getTopMovies = async () => {

    // Will try and attempt to get top movies and push into arrays to be returned elsewhere
    try {
        const response = await axios.get(`${url}/discover/movie${api_key}`);
        const responseData = response.data;
        const resultsArray = responseData.results;

        const titles = [];
        const posters = [];
        const id = [];

        // Iterating to add to array
        for (let i = 0; i < resultsArray.length; i++) {
            const movie = resultsArray[i];
            titles.push(movie.title);
            posters.push(`https://image.tmdb.org/t/p/original/${movie.poster_path}`);
            id.push(movie.id);
        }

        // Return needed info
        return [titles, posters, id]

    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};