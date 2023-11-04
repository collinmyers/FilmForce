import axios from 'axios';

const url = "https://api.themoviedb.org/3";
const api_key = "?api_key=ab1e98b02987e9593b705864efaf4798";

export const getTopMovies = async () => {
    try {
        const response = await axios.get(`${url}/discover/movie${api_key}`);
        const responseData = response.data;
        const resultsArray = responseData.results;

        const titles = [];
        const posters = [];
        const descriptions = [];
        const releaseDates = [];

        for (let i = 0; i < resultsArray.length; i++) {
            const movie = resultsArray[i];
            titles.push(movie.title);
            posters.push(`https://image.tmdb.org/t/p/original/${movie.poster_path}`);
            descriptions.push(movie.overview);
            releaseDates.push(movie.release_date);
        }

        return [titles, posters, descriptions, releaseDates]

    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};