import '../../styles/hub.css'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth } from '../../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';


const Search = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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

    if (isLoading) {
        return;
    }

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
                        <li><a onClick={handleLogout} id='logout'>Logout</a></li>
                    ) : (
                        <li><a href="/Login">Login</a></li>
                    )}
                </ul>
            </nav>

            <main className="content" id="search-section">
                <div className="search-bar">
                    <input type="text" placeholder="Search for movies" />
                    <button>Search</button>
                    {/* <button onClick={handleSearch}>Search</button> */}
                </div>


            </main>
        </div>
    );

};

export default Search