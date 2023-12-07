// Import necessary dependencies and styles
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getDocs, query, collection, where } from 'firebase/firestore';
import { auth, db } from '../../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { getTopMovies } from '../../../services/TMDB';
import FilmForcePoster from "../../assets/FilmForce-alt.png";
import axios from "axios-https-proxy-fix";
import '../../styles/hub.css'

// Define the Home component
const Home = () => {
    // State variables to manage the component's state
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [posters, setPosters] = useState([]);
    const [newestReviews, setNewestReviews] = useState([]);
    const [ids, setIds] = useState([]);

    // Initialize the navigate function from react-router-dom
    const navigate = useNavigate();

    // Fetch newest reviews from the database
    const fetchNewestReviews = async () => {
        const reviews = await getReviews();
        if (reviews) {
            setNewestReviews(reviews);
        }
    };

    // Calculate the average rating for a given movieID
    const calculateAverageRating = async (movieID) => {
        try {
            // Query the database for ratings of the specified movie
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

    // Fetch scores from an external API based on IMDb ID, movie name, and release date
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

    // Fetch details of a movie using its ID
    const fetchMovieDetails = async (movieId) => {
        try {
            // Define API endpoints and keys
            const url = "https://api.themoviedb.org/3";
            const api_key = "?api_key=ab1e98b02987e9593b705864efaf4798";

            // Fetch basic movie details
            const response = await fetch(`${url}/movie/${movieId}${api_key}`);
            const movieDetails = await response.json();

            // Fetch external IDs including IMDb ID
            const res = await fetch(`${url}/movie/${movieId}/external_ids${api_key}`);
            const externalIDs = await res.json();
            const imdbID = externalIDs.imdb_id;

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

            // Format release date in 'en-US' locale
            const enDate = new Date(movieDetails.release_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            // Get scores from an external API
            const ratings = await getScores(imdbID, movieDetails.title, enDate)

            // Calculate the FilmForce average rating
            const ourRating = await calculateAverageRating(movieDetails.id);

            // Map the required fields for the movie details
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

    // useEffect to fetch data and handle authentication state changes
    useEffect(() => {
        // Function to fetch data
        async function fetchData() {
            try {
                // Fetch top movie posters, their IDs, and titles
                const [, posters, id] = await getTopMovies();
                setIds(id);
                setPosters(posters);
            } catch (error) {
                console.error('Error fetching top movie posters:', error);
            }
            setIsLoading(false);
        }
        // Call fetchData function
        fetchData();
        // Call fetchNewestReviews function
        fetchNewestReviews();

        // Set up an authentication state change listener
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is logged in
                setLoggedIn(true);
            } else {
                // User is not logged in
                setLoggedIn(false);
            }
            setIsLoading(false);
        }, (error) => {
            console.error('Auth state change error:', error);
            setIsLoading(false);
        });

        // Cleanup function to unsubscribe from the authentication state change listener
        return () => unsubscribe();
    }, []);

    // Function to handle user logout
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                // Successfully logged out
                setLoggedIn(false);
                auth.currentUser.reload();
                navigate('/');
            })
            .catch((error) => {
                // Logout error
                console.error('Logout Error:', error);
            });
    };

    // Function to get reviews from the database
    const getReviews = async () => {
        try {
            const reviewsQuery = query(
                collection(db, 'movieRatingComment')
            );

            const snapshot = await getDocs(reviewsQuery);

            const reviews = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            return reviews;
        } catch (error) {
            console.error('Error fetching newest reviews:', error);
            return null; // or handle the error appropriately
        }
    };

    // Render the JSX for the Home component
    return (
        <div>
            {/* Header section */}
            <header className="site-header sh-home">
                <h1>Welcome to Film<span id="home-force">Force</span></h1>
                <p>For the Love of Cinema</p>
            </header>

            {/* Navigation bar */}
            <nav className="main-nav">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/Search">Search</a></li>
                    {/* Show Settings link if user is logged in */}
                    {loggedIn && <li><a href="/Settings">Settings</a></li>}
                    {/* Show Logout link if user is logged in, otherwise show Login link */}
                    {loggedIn ? (
                        <li> <a onClick={handleLogout} id='logout'>Logout</a></li>
                    ) : (
                        <li><a href="/Login">Login</a></li>
                    )}
                </ul>
            </nav>

            {/* Main content section */}
            <main className="content" id="movies-section">
                <div className="movie-home-section">
                    {/* Featured Movies section */}
                    <section className="featured-movies">
                        <h2>Trending Movies</h2>
                        <div className="movie-grid">
                            {isLoading ? (
                                // Show loading message while data is being fetched
                                <p>Loading...</p>
                            ) : (
                                // Display movie posters with clickable images
                                <div className="movie">
                                    {posters.slice(0, 6).reduce((result, poster, index) => {
                                        if (index % 2 === 0) {
                                            const nextPoster = posters[index + 1];
                                            result.push(
                                                <div key={index} className="poster-row">
                                                    {/* Clickable movie posters */}
                                                    <img src={poster} style={{ cursor: 'pointer' }} alt="Movie Poster" onClick={() => fetchMovieDetails(ids[index])} />
                                                    {nextPoster && <img src={nextPoster} style={{ cursor: 'pointer' }} onClick={() => fetchMovieDetails(ids[index + 1])} alt="Movie Poster" />}
                                                </div>
                                            );
                                        }
                                        return result;
                                    }, [])}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Newest Reviews section */}
                <section id="new-reviews">
                    <h2 className="main-titles">Newest Reviews</h2>
                    {newestReviews.length !== 0 && (
                        // Display a list of newest reviews if available
                        <ul className="review-list">
                            {newestReviews.map((review) => (
                                <li key={review.id}>
                                    <a>{`${review.movieName} ${review.FilmForceRating}/5 - ${review.userReview}`}</a>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </main>
        </div>
    );
};

// Export the Home component as the default export
export default Home;
