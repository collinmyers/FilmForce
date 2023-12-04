import '../../styles/hub.css';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth, db } from '../../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default function UserReviews() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();

    const getReviews = async () => {
        try {
            const reviewsQuery = query(
                collection(db, 'movieRatingComment'),
                where('userID', '==', auth.currentUser.uid)
            );

            const snapshot = await getDocs(reviewsQuery);

            const reviewsList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setReviews(reviewsList);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

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

        getReviews();

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigate('/');
                setLoggedIn(false);
                auth.currentUser.reload();
            })
            .catch((error) => {
                console.error('Logout Error:', error);
            });
    };

    const handleUpdate = async (reviewId, newRating, newUserReview) => {
        try {
            const entryRef = doc(db, 'movieRatingComment', reviewId);
            const updateData = {};

            if (!isNaN(newRating) && newRating >= 1 && newRating <= 5) {
                updateData.FilmForceRating = newRating;
            }

            if (newUserReview) {
                updateData.userReview = newUserReview;
            }

            await updateDoc(entryRef, updateData);
            getReviews();

            alert("Review Updated Successfully!");
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteDoc(doc(db, 'movieRatingComment', reviewId));
            getReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    return (
        <div>
            <header className="site-header settings-header">
                <h1>Welcome to Film<span id="home-force">Force</span></h1>
                <p>For the Love of Cinema</p>
            </header>

            <nav className="main-nav setting-nav">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/Search">Search</a></li>
                    {loggedIn && <li><a href="/Settings">Settings</a></li>}
                    {loggedIn ? (
                        <li><a onClick={handleLogout} id='logout'>Logout</a></li>
                    ) : (
                        <li><a href="/Login">Login</a></li>
                    )}
                </ul>
            </nav>

            <div className='reviews-container'>
                <h1>Your Reviews:</h1>
                <ul className="reviews-list">
                    {reviews.map((review, index) => (
                        <li key={index} className="review-item">
                            <div className="review-box">
                                <h2 style={{ textAlign: 'left', margin: 10 }}>
                                    {review.movieName} - {review.FilmForceRating}/5
                                </h2>

                                <label htmlFor={`rating-${review.id}`}>Update Rating: </label>
                                <input
                                    type="number"
                                    id={`rating-${review.id}`}
                                    min="1"
                                    max="5"
                                    defaultValue={review.FilmForceRating}
                                    style={{ width: 40, marginRight: 20 }}
                                />

                                <textarea
                                    id={review.id}
                                    rows="10"
                                    cols="50"
                                    defaultValue={review.userReview}
                                />

                                <button
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

                                <button onClick={() => handleDeleteReview(review.id)}>
                                    <p>Delete</p>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div >
    );
}
