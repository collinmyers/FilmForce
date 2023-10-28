import '../../styles/hub.css'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth } from '../../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';

import Poster from '../../assets/Poster.jpg'

const MovieProfilePage = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setLoggedIn(true);
            }
        });
    }, []);

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setLoggedIn(false);
                auth.currentUser.reload();
                navigate("/")
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
                    <li><a href="/Movie">Movies</a></li>
                    {loggedIn && <li><a href="/Settings">Settings</a></li>}
                    {loggedIn ? (
                        <li> <a onClick={handleLogout} id='logout'>Logout</a></li>
                    ) : (
                        <li><a href="/Login">Login</a></li>
                    )}
                </ul>
            </nav>

            <h1 className="movie-title">Shrek</h1>
            <div className="movie-page">
                <section className="left">

                    <img id="movie-poster" src={Poster} alt="Shrek Movie Poster" />

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
                        <p>A mean lord exiles fairytale creatures to the swamp of a grumpy ogre, who must go on a quest and rescue a princess for the lord in order to get his land back.</p>
                    </div>

                    <div id="details">
                        <h2 className="movie-header">Movie Details</h2>
                        <ul id="movie-details">
                            <li><strong>Release Date:</strong> April 21, 2001</li>
                            <li><strong>Genre:</strong> Animation, Adventure, Comedy</li>
                            <li><strong>Directors:</strong> Andrew Adamson & Vicky Jenson</li>
                            <li><strong>Starring:</strong> Mike Myers, Eddie Murphy, Cameron Diaz</li>
                            <li><strong>Runtime:</strong> 1h 30min</li>
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
