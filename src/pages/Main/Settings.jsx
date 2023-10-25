import '../../styles/hub.css'

const Settings = () => {
    return (
        <div>
            <header className="site-header settings-header">
                <h1>Welcome to Film<span id="home-force">Force</span></h1>
                <p>For the Love of Cinema</p>
            </header>

            <nav className="main-nav setting-nav">
                <ul>
                    <li><a href="../HTML/home.html">Home</a></li>
                    <li><a href="../HTML/movie.html">Movies</a></li>
                    <li><a href="../HTML/login.html">Login/Sign Up</a></li>
                    <li><a href="../HTML/settings.html">Settings</a></li>
                </ul>
            </nav>

                <h1 className="account-settings" id="settings-title">Settings</h1>
                <section className="account-settings" id="change-pass">
                <h2 id="acct-settings-title">Account Settings</h2>

                    <h2 id="change-pass-title">Change Password</h2>
                    <form>
                        <input type="password" id="current-password" name="current-password" placeholder="Current Password"/><br/><br/>

                        <input type="password" id="new-password" name="new-password" placeholder="New Password"/><br/><br/>

                        <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm Password"/><br/><br/>

                        <input id="change-pass-button" type="submit" value="Change Password"/>
                    </form>
                </section>

                <section className="account-settings" id="delete-acct">
                    <button>Delete Account</button>
                    <p id="delete-details"> Deleting your account will permanently delete your profile and all associated data.</p>
                </section>

        </div>
    );
};

export default Settings;
