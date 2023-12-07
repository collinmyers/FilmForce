// Import external styles for the component
import '../../styles/hub.css';

// Import necessary dependencies from Firebase, React, and React Router
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth, db } from '../../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Define the UserReviews component
export default function UserReviews() {
    // State variables to manage the component's state
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();

    // Function to get the user's reviews from the database
    const getReviews = async () => {
        try {
            // Query to get the reviews for the current user
            const reviewsQuery = query(
                collection(db, 'movieRatingComment'),
                where('userID', '==', auth.currentUser.uid)
            );

            // Get the snapshot of the reviews
            const snapshot = await getDocs(reviewsQuery);

            // Map the reviews from the snapshot and update the state
            const reviewsList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setReviews(reviewsList);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    // useEffect to handle authentication state changes and fetch user reviews
    useEffect(() => {
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

        // Fetch the user's reviews
        getReviews();

        // Cleanup function to unsubscribe from the authentication state change listener
        return () => unsubscribe();
    }, []);

    // If the component is still loading, return a loading message
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Function to handle user logout
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                // Logout successful
                navigate('/');
                setLoggedIn(false);
                auth.currentUser.reload();
            })
            .catch((error) => {
                // Logout error
                console.error('Logout Error:', error);
            });
    };

    // Function to handle updating a review
    const handleUpdate = async (reviewId, newRating, newUserReview) => {
        try {
            // Reference to the review document in the database
            const entryRef = doc(db, 'movieRatingComment', reviewId);
            const updateData = {};

            // Update FilmForceRating if newRating is a valid number between 1 and 5
            if (!isNaN(newRating) && newRating >= 1 && newRating <= 5) {
                updateData.FilmForceRating = newRating;
            }

            // Update userReview if newUserReview is provided
            if (newUserReview) {
                updateData.userReview = newUserReview;
            }

            // Update the document in the database
            await updateDoc(entryRef, updateData);

            // Fetch and update the reviews
            getReviews();

            alert("Review Updated Successfully!");
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    // Function to handle deleting a review
    const handleDeleteReview = async (reviewId) => {
        try {
            // Delete the review document from the database
            await deleteDoc(doc(db, 'movieRatingComment', reviewId));

            // Fetch and update the reviews
            getReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    // Render the UserReviews component
    return (
        <div>
            {/* Header section */}
            <header className="site-header settings-header">
                <h1>Welcome to Film<span id="home-force">Force</span></h1>
                <p>For the Love of Cinema</p>
            </header>

            {/* Navigation bar */}
            <nav className="main-nav setting-nav">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/Search">Search</a></li>
                    {/* Show Settings link if user is logged in */}
                    {loggedIn && <li><a href="/Settings">Settings</a></li>}
                    {/* Show Logout link if user is logged in, otherwise show Login link */}
                    {loggedIn ? (
                        <li><a onClick={handleLogout} id='logout'>Logout</a></li>
                    ) : (
                        <li><a href="/Login">Login</a></li>
                    )}
                </ul>
            </nav>

            {/* Container for user reviews */}
            <div className='reviews-container'>
                <h1>Your Reviews:</h1>
                {/* List of user reviews */}
                <ul className="reviews-list">
                    {reviews.map((review, index) => (
                        <li key={index} className="review-item">
                            <div className="review-box">
                                {/* Display movie title */}
                                <h2 className='reviewMovieTitle'>
                                    {review.movieName}
                                </h2>

                                {/* Editable textarea for user review */}
                                <textarea
                                    className='editable-review'
                                    id={review.id}
                                    rows="10"
                                    cols="50"
                                    defaultValue={review.userReview}
                                />

                                {/* Container for score input */}
                                <div className='scoreContainer'>
                                    <p className='scoreText'>Score</p>
                                    {/* Editable score input */}
                                    <input
                                        type="number"
                                        className='editable-score'
                                        id={`rating-${review.id}`}
                                        min="1"
                                        max="5"
                                        defaultValue={review.FilmForceRating}
                                    />
                                </div>

                                {/* Container for update and delete buttons */}
                                <div className='updatButtonsContainer'>
                                    {/* Button to update the review */}
                                    <button
                                        className='edit-review-button'
                                        onClick={() =>
                                            handleUpdate(
                                                review.id,
                                                parseInt(document.getElementById(`rating-${review.id}`).value, 10),
                                                document.getElementById(review.id).value
                                            )
                                        }
                                    >
                                        <p>Update</p>
                                    </button>

                                    {/* Button to delete the review */}
                                    <button
                                        className='edit-review-button'
                                        onClick={() => handleDeleteReview(review.id)}>
                                        <p>Delete</p>
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
