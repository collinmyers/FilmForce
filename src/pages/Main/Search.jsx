import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import FilmForcePoster from "../../assets/FilmForce-alt.png";
import { getTopMovies } from '../../../services/TMDB';
import axios from "axios-https-proxy-fix";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../../services/firebaseConfig';

const Search = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState({ titles: [], posters: [] });
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
            setIsLoading(false);
        }, (error) => {
            console.error('Auth state change error:', error);
            setIsLoading(false);
        });

        const fetchTrendingMovies = async () => {
            const [titles, posters, id] = await getTopMovies();
            setTrendingMovies({ titles, posters, id });
        };
        fetchTrendingMovies();

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setLoggedIn(false);
                auth.currentUser.reload();
                navigate("/");
            })
            .catch((error) => {
                console.error('Logout Error:', error);
            });
    };

    const calculateAverageRating = async (movieID) => {
        try {
            const ratingsQuery = query(
                collection(db, 'movieRatingComment'),
                where('movieID', '==', movieID)
            );

            const snapshot = await getDocs(ratingsQuery);

            if (snapshot.empty) {
                return '-/5';
            }

            let totalRating = 0;
            let numberOfRatings = 0;

            snapshot.forEach((doc) => {
                const rating = doc.data().FilmForceRating;
                totalRating += rating;
                numberOfRatings++;
            });

            const averageRating = totalRating / numberOfRatings;

            return averageRating + "/5";
        } catch (error) {
            console.error('Error calculating average rating:', error);
            return 'N/A';
        }
    };

    const getScores = async (imdbID, name, date) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/scores`, {
                params: {
                    movieID: imdbID,
                    movieName: name,
                    releaseDate: date
                }
            });

            return response;
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    }

    const fetchMovieDetails = async (movieId) => {
        try {

            const url = "https://api.themoviedb.org/3";
            const api_key = "?api_key=ab1e98b02987e9593b705864efaf4798";

            // Fetch basic movie details
            const response = await fetch(`${url}/movie/${movieId}${api_key}`);
            const movieDetails = await response.json();

            const res = await fetch(`${url}/movie/${movieId}/external_ids${api_key}`);
            const externalIDs = await res.json();
            const imdbID = externalIDs.imdb_id;

            // console.log("imdb id" + imdbID);

            // Fetch credits for top cast and directors
            const creditsResponse = await fetch(`${url}/movie/${movieId}/credits${api_key}`);
            const creditsData = await creditsResponse.json();

            // Get top 3 cast members
            const top3Cast = creditsData.cast.slice(0, 3).map((castMember) => castMember.name).join(', ');

            // Get top 3 directors
            const top3Directors = creditsData.crew
                .filter((crewMember) => crewMember.job === 'Director')
                .slice(0, 3)
                .map((director) => director.name)
                .join(', ');

            // Convert runtime to hours and minutes
            const runtimeHours = Math.floor(movieDetails.runtime / 60);
            const runtimeMinutes = movieDetails.runtime % 60;

            const enDate = new Date(movieDetails.release_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            const ratings = await getScores(imdbID, movieDetails.title, enDate)

            const ourRating = await calculateAverageRating(movieDetails.id);

            // Map the required fields
            const details = {
                id: movieDetails.id,
                title: movieDetails.title,
                genres: movieDetails.genres.map((genre) => genre.name).join(', '),
                releaseDate: enDate,
                overview: movieDetails.overview,
                poster: movieDetails.poster_path ? `https://image.tmdb.org/t/p/original/${movieDetails.poster_path}` : FilmForcePoster,
                top3Cast,
                top3Directors,
                runtime:
                    runtimeHours > 0
                        ? `${runtimeHours} ${runtimeHours === 1 ? 'hour' : 'hours'}${runtimeMinutes > 0 ? ` ${runtimeMinutes} minutes` : ''}`
                        : `${runtimeMinutes} minutes`,
                FFrating: ourRating,
                imdbRating: JSON.stringify(ratings.data.scores.imdb).slice(1, -1),
                rottenTomatoesRating: JSON.stringify(ratings.data.scores.rt).slice(1, -1)
            };

            // Navigate to the movie page with the movie details
            navigate(`/movie/${details.id}`, { state: details });

        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    const handleSearch = async () => {
        if (searchQuery.trim() === '') {
            alert('Please enter a search term');
            return;
        }

        const url = "https://api.themoviedb.org/3";
        const api_key = "?api_key=ab1e98b02987e9593b705864efaf4798";

        try {
            const response = await fetch(`${url}/search/movie${api_key}&query=${searchQuery}`);
            if (!response.ok) {
                throw new Error(`TMDB API request failed with status ${response.status}`);
            }

            const responseData = await response.json();

            const resultsLength = responseData.results.length;

            const resultsArray = responseData.results.slice(0, resultsLength);

            setSearchResults(resultsArray);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert('An error occurred while fetching data');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') handleSearch();
    };

    if (isLoading) {
        return null;
    }

    return (
        <div>
            <header className="site-header sh-home">
                <h1>Welcome to Film<span id="home-force">Force</span></h1>
                <p>For the Love of Cinema</p>
            </header>

            <nav className="main-nav">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/Search">Search</a></li>
                    {loggedIn && <li><a href="/Settings">Settings</a></li>}
                    {loggedIn ? (
                        <li> <a onClick={handleLogout} id='logout'>Logout</a></li>
                    ) : (
                        <li><a href="/Login">Login</a></li>
                    )}
                </ul>
            </nav>

            <main className="content content-search" id="search-section">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search for movies"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>

                <div className="search-results">
                    {searchResults.length > 0 ? (
                        searchResults.map((movie) => (
                            <div key={movie.id} className="movie-result">
                                {movie.poster_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                        alt={movie.title}
                                        onClick={() => fetchMovieDetails(movie.id)} // Pass the entire movie object
                                        style={{ cursor: 'pointer' }}
                                    />
                                ) : (
                                    <>
                                        <br />
                                        <br />
                                        <h3>{movie.title}</h3>
                                        <img
                                            src={FilmForcePoster}
                                            alt="FilmForce Poster"
                                            onClick={() => fetchMovieDetails(movie.id)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        trendingMovies.titles.map((title, index) => (
                            <div key={index} className="movie-result">
                                <img
                                    src={trendingMovies.posters[index]}
                                    alt={title}
                                    onClick={() => fetchMovieDetails(trendingMovies.id[index])}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* Pass selectedMovie to the Movie component */}
                {/* {selectedMovie !== null && (
                    <Movie {...selectedMovie} />
                )} */}
            </main>
        </div>
    );
};

export default Search;
