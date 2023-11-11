import '../../styles/hub.css';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth } from '../../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import FilmForcePoster from "../../assets/FilmForce-alt.png";

const Search = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const navigate = useNavigate();

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

            console.log(resultsArray);

            setSearchResults(resultsArray);

        } catch (error) {
            console.error("Error fetching data:", error);
            alert('An error occurred while fetching data');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            // If Enter key is pressed, trigger the search
            handleSearch();
        }
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
                    {searchResults.map((movie) => (
                        <div key={movie.id} className="movie-result">
                            <h3>{movie.title}</h3>
                            {movie.poster_path ? (
                                <img
                                    src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                    alt={movie.title}
                                />
                            ) : (
                                <img
                                    src={FilmForcePoster}
                                    alt="FilmForce Poster"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );

}
export default Search;
