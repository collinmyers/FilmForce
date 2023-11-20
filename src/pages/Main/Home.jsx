import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getDocs, query, collection } from 'firebase/firestore';
import { auth, db } from '../../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { getTopMovies } from '../../../services/TMDB';
import '../../styles/hub.css'

const Home = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [posters, setPosters] = useState([]);
    const [newestReviews, setNewestReviews] = useState([]);
    const [reviewTitles, setReviewTitles] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            try {
                const [, posters] = await getTopMovies(); // We don't need titles in this case
                setPosters(posters);
            } catch (error) {
                console.error('Error fetching top movie posters:', error);
            }
            setIsLoading(false);
        }

        const fetchNewestReviews = async () => {
            const reviews = await getReviews();
            if (reviews) {
                setNewestReviews(reviews);
            }
        };

        fetchNewestReviews();
        fetchData();

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

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setLoggedIn(false);
                auth.currentUser.reload();
                navigate('/');
            })
            .catch((error) => {
                console.error('Logout Error:', error);
            });
    };

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

            const url = "https://api.themoviedb.org/3";
            const api_key = "?api_key=ab1e98b02987e9593b705864efaf4798";

            const list = [];

            reviews.forEach(async (doc) => {
                // Fetch basic movie details
                const response = await fetch(`${url}/movie/${doc.movieID}${api_key}`);
                const movieDetails = await response.json();

                list.push(movieDetails.title);
            });

            setReviewTitles(list);
            return reviews;
        } catch (error) {
            console.error('Error fetching newest reviews:', error);
            return null; // or handle the error appropriately
        }
    };

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

            <main className="content" id="movies-section">
                <div className="movie-home-section">
                    <section className="featured-movies">
                        <h2>Trending Movies</h2>
                        <div className="movie-grid">
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <div className="movie">
                                    {posters.slice(0, 6).reduce((result, poster, index) => {
                                        if (index % 2 === 0) {
                                            const nextPoster = posters[index + 1];
                                            result.push(
                                                <div key={index} className="poster-row">
                                                    <img src={poster} alt="Movie Poster" />
                                                    {nextPoster && <img src={nextPoster} alt="Movie Poster" />}
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
                <section id="new-reviews">
                    <h2 className="main-titles">Newest Reviews</h2>
                    {newestReviews.length !== 0 && (
                        <ul className="review-list">
                            {newestReviews.map((review) => (
                                <li>
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

export default Home;
