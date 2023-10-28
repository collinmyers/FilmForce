import '../../styles/hub.css'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth } from '../../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Home = () => {
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
                    <li><a href="/Movie">Movies</a></li>
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
                        <h2 className="main-titles">Featured Movies</h2>
                        <h3 className="movie-name">Oppenheimer</h3>
                        <iframe className="youtube-trailer" src="https://www.youtube.com/embed/uYPbbksJxIg?si=KiluKBgH0hunwCXY" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                        <h3 className="movie-name">Saw X</h3>
                        <iframe className="youtube-trailer" src="https://www.youtube.com/embed/t3PzUo4P21c?si=q0nodolSFknjyU1x" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                    </section>
                    <section className="popular-movies">
                        <h2 className="main-titles">Popular Movies</h2>
                        <h3 className="movie-name">Shrek</h3>
                        <iframe className="youtube-trailer" src="https://www.youtube.com/embed/lNfei4YCZ5o?si=JveGRsUna_eZploa" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                        <h3 className="movie-name">Talladega Nights</h3>
                        <iframe className="youtube-trailer" src="https://www.youtube.com/embed/YfGRg0FLxtE?si=GBLyIeE9VccanV5w" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
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
