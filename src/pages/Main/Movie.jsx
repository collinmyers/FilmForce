// Import React and necessary dependencies
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../../services/firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

// Define the MovieProfilePage component
const MovieProfilePage = () => {
    // State variables to manage the component's state
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [rating, setRating] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState([]);

    // Initialize the navigate function and location hook from react-router-dom
    const navigate = useNavigate();
    const { state } = useLocation();

    // Extract movie details from the state
    const {
        id, title, genres, releaseDate, overview, poster, top3Cast,
        top3Directors, runtime, FFrating, imdbRating, rottenTomatoesRating
    } = state;

    // Function to fetch reviews for the current movie
    const fetchReviews = async () => {
        try {
            const reviewsQuery = query(
                collection(db, 'movieRatingComment'),
                where('movieID', '==', id)
            );

            const querySnapshot = await getDocs(reviewsQuery);

            // Map the query snapshot to an array of review objects
            const reviewsData = querySnapshot.docs.map(doc => doc.data());

            setReviews(reviewsData);
        } catch (error) {
            console.error('Error fetching reviews: ', error);
        }
    };

    // useEffect to fetch data and handle authentication state changes
    useEffect(() => {
        // Fetch reviews and set up authentication state change listener
        fetchReviews();

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

    // If still loading, return null
    if (isLoading) {
        return null;
    }

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

    // Function to handle the submission of the review
    const handleReviewSubmit = async () => {
        if (loggedIn) {
            const user = auth.currentUser;

            if (!rating || !reviewText) {
                // Alert if rating or review text is missing
                alert('Please provide both a rating and a review text.');
                return;
            }

            try {
                // Check if the user already has a review for this movie
                const reviewsQuery = query(
                    collection(db, 'movieRatingComment'),
                    where('movieID', '==', id),
                    where('userID', '==', user.uid)
                );

                const existingReviews = await getDocs(reviewsQuery);

                if (!existingReviews.empty) {
                    // Alert if user already submitted a review for this movie
                    alert('You have already submitted a review for this movie.');
                    return;
                }

                // Add the review to Firestore
                await addDoc(collection(db, 'movieRatingComment'), {
                    movieName: title,
                    movieID: id,
                    FilmForceRating: rating,
                    userReview: reviewText,
                    userID: user.uid,
                });

                // Optionally, you can reset the state after submitting the review
                setRating(null);
                setReviewText('');
                alert('Review submitted successfully!');
            } catch (error) {
                console.error('Error submitting review:', error);
                alert('An error occurred while submitting the review. Please try again.');
            }
        } else {
            // Alert if user is not logged in
            alert('Please log in to leave a review!');
        }
    };

    // Function to handle the change in rating
    const handleRatingChange = (event) => {
        setRating(parseInt(event.target.value, 10));
    };

    // Function to handle the change in review text
    const handleReviewTextChange = (event) => {
        setReviewText(event.target.value);
    };

    // JSX for rendering the MovieProfilePage component
    return (
        <div>
            {/* Header section */}
            <header className="site-header">
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

            {/* Movie details section */}
            <h1 className="movie-title">{title}</h1>
            <div className="movie-page">
                <section className="left">
                    {/* Movie poster and ratings */}
                    <img id="movie-poster" src={poster} alt="Movie Poster" />
                    <h2 className="movie-header">Movie Ratings</h2>
                    <h3 id="FF-rating">FilmForce Rating</h3>
                    <h4><span id="home-force">{FFrating}</span></h4>
                    <h3 id="IMDB-rating"> IMDB Rating</h3>
                    <h4><span id="home-force">{imdbRating}</span></h4>
                    <h3 id="RT-rating">Rotten Tomatoes Rating</h3>
                    <h4><span id="home-force">{rottenTomatoesRating}</span></h4>
                </section>

                <section className="right">
                    {/* Movie overview */}
                    <div id="overview">
                        <h2 className="movie-header">Movie Overview</h2>
                        <p>{overview}</p>
                    </div>

                    {/* Movie details */}
                    <div id="details">
                        <h2 className="movie-header">Movie Details</h2>
                        <ul id="movie-details">
                            <li><strong>Release Date: </strong>{releaseDate}</li>
                            <li><strong>Genre: </strong>{genres}</li>
                            <li><strong>Directors: </strong>{top3Directors}</li>
                            <li><strong>Starring: </strong>{top3Cast}</li>
                            <li><strong>Runtime: </strong>{runtime}</li>
                        </ul>
                    </div>

                    {/* Leave a review section */}
                    <div id="leave-review">
                        <h2 className="movie-header">Leave a Review and Rating</h2>
                        {/* Rating input */}
                        <div className="rating">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <React.Fragment key={value}>
                                    <input
                                        id={`rating${value}`}
                                        type="radio"
                                        name="rating"
                                        value={value}
                                        onChange={handleRatingChange}
                                        checked={rating === value}
                                    />
                                    <label htmlFor={`rating${value}`}>{value}</label>
                                </React.Fragment>
                            ))}
                        </div>
                        {/* Review text input */}
                        <label htmlFor="review-text">What did you think about the movie?</label>
                        <br />
                        <textarea
                            id="review-text"
                            rows="10"
                            cols="50"
                            value={reviewText}
                            onChange={handleReviewTextChange}
                        />
                        {/* Submit review button */}
                        <button className="movieReviewSubmit" onClick={handleReviewSubmit}>Submit Review</button>
                    </div>
                </section>
            </div>

            {/* Display reviews section */}
            <div className='reviews-container'>
                <h2 className='reviewsTitle'>{title} Reviews</h2>
                <ul className="reviews-list">
                    {/* Map over reviews and display each review */}
                    {reviews.map((review, index) => (
                        <li key={index} className="review-item">
                            <div className="review-box">
                                <p className='user-review'>{review.FilmForceRating}/5 - {review.userReview}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// Export the MovieProfilePage component as the default export
export default MovieProfilePage;
