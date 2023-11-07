import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { getTopMovies } from '../../../services/TMDB';
import '../../styles/hub.css'

const Home = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [posters, setPosters] = useState([]);

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

        fetchData();

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
                navigate('/');
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
                        <li> <a onClick={handleLogout} id='logout'>Logout</a></li>
                    ) : (
                        <li><a href="/Login">Login</a></li>
                    )}
                </ul>
            </nav>

            <main className="content" id="movies-section">
                <div className="movie-home-section">
                    <section className="featured-movies">
                        <h2>Trending Movie Posters</h2>
                        <div id="movie-list">
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <div className="movie-grid">
                                    {posters.slice(0, 6).map((poster, index) => (
                                        <div key={index} className="movie">
                                            <img src={poster} alt="Movie Poster" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
                <section id="new-reviews">
                    <h2 className="main-titles">Newest Reviews</h2>
                    <ul className="review-list">
                        <li><a>User 1: 8/10 - Line gondy pow pow ride around heli. White room presta grind bail crank crunchy tele pow rail derailleur giblets slash steeps berm. Bear trap pow huck, hellflip stomp method first tracks Whistler sucker hole stoked yard sale afterbang deck. Hot dogging stunt reverse camber stomp gondy gear jammer, face shots huckfest back country pow pow ollie butter carbon. Whip 180 dirtbag stunt liftie steed face plant north shore twister freshies brain bucket T-bar backside pipe.</a></li>
                        <li><a>User 2: 7/10 - Line death cookies deck, berm nose press OTB rail stoked schwag brain bucket single track cruiser McTwist bonk. Grind travel wack back country punter heli flow yard sale first tracks. Road rash nose booter, first tracks hurl carcass ripping dirt huckfest. Wheels gnar snake bite clean heli free ride poaching dust on crust. Hellflip nose press hardtail, lid carbon BB misty. Shreddin white room gaper gondy.</a></li>
                        <li><a>User 3: 8/10 - Pow pow brain bucket road rash piste brain bucket, flow rail. Ollie Bike schwag Ski ride whip shreddin derailleur, caballerial face shots. Manny liftie huckfest heli park stomp, skid apres flow deck. Twister frozen chicken heads chillax bonk wheelie. Endo Ski corn, shreddin schwag pow pow Bike chillax.</a></li>
                        <li><a>User 4: 9/10 - Gondy granny gear flow over the bars, avie bail bro couloir stunt yard sale gaper hammer grunt daffy. Grind bear trap gapers switch sucker hole, sharkbite glades gnar smear face plant. Yard sale stoked bear trap, berm wheels Snowboard laps. Free ride ripping free ride death cookies pow rail smear, bonk groomer hardtail whip crunchy huckfest grind stoked.</a></li>
                        <li><a>User 5: 6/10 - Skid piste ACL pinner, bomb gnar poaching. Method yard sale north shore Skate 180 single track greasy smear cornice cruiser. Rock roll carve dust on crust wheels snake bite BB spread eagle gapers Whistler. Newschooler white room T-bar clipless park bomb hole, spin rock roll pow rock-ectomy OTB. Skid afterbang phat bomb hole Bike brain bucket hammer frozen chicken heads bowl cruiser first tracks hero yard sale. Avie bro euro pinner betty carbon flowy afterbang bowl spread eagle gapers.</a></li>
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default Home;
