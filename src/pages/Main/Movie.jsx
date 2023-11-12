import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../../services/firebaseConfig';
import { useNavigate, useLocation } from 'react-router-dom';

const MovieProfilePage = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const { state } = useLocation();

    // Now, state contains the details passed from the previous component
    const { title, genres, releaseDate, overview, poster, top3Cast, top3Directors, runtime } = state;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log('User is signed in:', user);
                setLoggedIn(true);
            } else {
                console.log('No user is signed in.');
                setLoggedIn(false);
            }
            setIsLoading(false);
        }, (error) => {
            console.error('Auth state change error:', error);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return null;
    }

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

    return (
        <div>
            <header className="site-header">
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

            <h1 className="movie-title">{title}</h1>
            <div className="movie-page">
                <section className="left">

                    <img id="movie-poster" src={poster} alt="Movie Poster" />

                    <h2 className="movie-header">Movie Ratings</h2>
                    <h3 id="FF-rating">FilmForce Rating</h3>
                    <h4><strong>Rating: </strong> 5.0/5.0</h4>
                    <h3 id="IMDB-rating"> IMDB Rating</h3>
                    <h4><strong>Rating: </strong> 7.9/10.0</h4>
                    <h3 id="RT-rating">Rotten Tomatoes Rating</h3>
                    <h4><strong>Rating: </strong> 88%</h4>
                </section>

                <section className="right">
                    <div id="overview">
                        <h2 className="movie-header">Movie Overview</h2>
                        <p>{overview}</p>
                    </div>

                    <div id="details">
                        <h2 className="movie-header">Movie Details</h2>
                        <ul id="movie-details">
                            <li><strong>Release Date: </strong>{releaseDate}</li>
                            <li><strong>Genre: </strong>{genres}</li>
                            <li><strong>Directors: </strong>{top3Directors}</li>
                            <li><strong>Starring:</strong>{top3Cast}</li>
                            <li><strong>Runtime: </strong>{runtime}</li>
                        </ul>
                    </div>
                    <div id="leave-review">
                        <h2 className="movie-header">Leave a Review and Rating</h2>
                        <div className="rating">
                            <input id="rating1" type="radio" name="rating" value="1" />
                            <label htmlFor="rating1">1</label>
                            <input id="rating2" type="radio" name="rating" value="2" />
                            <label htmlFor="rating2">2</label>
                            <input id="rating3" type="radio" name="rating" value="3" />
                            <label htmlFor="rating3">3</label>
                            <input id="rating4" type="radio" name="rating" value="4" />
                            <label htmlFor="rating4">4</label>
                            <input id="rating5" type="radio" name="rating" value="5" />
                            <label htmlFor="rating5">5</label>
                        </div>
                        <label htmlFor="review-text">What did you think about the movie:</label>
                        <br />
                        <textarea id="review-text" rows="10" cols="50" />
                    </div>
                </section>
            </div>
        </div>
    );
};


export default MovieProfilePage;