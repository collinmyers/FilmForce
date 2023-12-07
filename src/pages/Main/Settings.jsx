// Import external styles for the component
import '../../styles/hub.css';

// Import necessary dependencies from Firebase, React, and React Router
import { onAuthStateChanged, signOut, EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth } from '../../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';

// Define the Settings component
export default function Settings() {
    // State variables to manage the component's state
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    // Navigate function from React Router
    const navigate = useNavigate();

    // useEffect to handle authentication state changes
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

        // Cleanup function to unsubscribe from the authentication state change listener
        return () => unsubscribe();
    }, []);

    // If the component is still loading, return nothing
    if (isLoading) {
        return null;
    }

    // Function to handle changing the user's password
    const handleChangePassword = async () => {
        const user = auth.currentUser;

        try {
            // Reauthenticate the user with their current email and password
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential).then(() => {
                // Update the user's password
                updatePassword(user, newPassword).then(() => {
                    alert("Password Updated")
                    user.reload();
                })
            });
        } catch (error) {
            console.error(error)
        }
    };

    // Function to handle displaying a confirmation message for account deletion
    const handleConfirmationMessage = () => {
        const isConfirmed = window.confirm('Are you sure you want to delete your account?');

        if (isConfirmed) {
            // If confirmed, proceed with account deletion
            handleDelete();
        } else {
            // If not confirmed, do nothing
            return;
        }
    };

    // Function to handle deleting the user's account
    const handleDelete = async () => {
        const user = auth.currentUser;

        try {
            // Delete the user's account
            await deleteUser(user);
            navigate("/")
            await signOut(auth)
            alert("Account Successfully Deleted");

        } catch (error) {
            console.error(error)
        }
    };

    // Function to validate the new password and confirm password
    const validateNewPassword = () => {
        if ((newPassword !== confirmNewPassword)) {
            // If passwords do not match, display an alert and reset password fields
            alert("Password and Confirm Password Must Match");
            setNewPassword('');
            setConfirmNewPassword('');
        } else if (newPassword.length < 8 || confirmNewPassword.length < 8) {
            // If passwords are less than 8 characters, display an alert and reset password fields
            alert("Password Must Be at Least 8 Characters Long");
            setNewPassword('');
            setConfirmNewPassword('');
        }
    };

    // Function to handle user logout
    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                // Logout successful
                navigate("/")
                setLoggedIn(false);
                auth.currentUser.reload();
            })
            .catch((error) => {
                // Logout error
                console.error('Logout Error:', error);
            });
    };

    // Function to navigate to the user's reviews
    const handleEditReviews = () => {
        navigate(`/${auth.currentUser.uid}/UserReviews`)
    }

    // Render the Settings component
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
                        <li> <a onClick={handleLogout} id='logout'>Logout</a></li>
                    ) : (
                        <li><a href="/Login">Login</a></li>
                    )}
                </ul>
            </nav>

            {/* Settings title */}
            <h1 className="account-settings" id="settings-title">Settings</h1>

            {/* Button to navigate to edit reviews */}
            <button className='edit-reviews-goto' onClick={handleEditReviews}>Edit Reviews</button>

            {/* Account Settings section */}
            <section className="account-settings" id="change-pass">
                <h2 id="acct-settings-title">Account Settings</h2>

                {/* Display user's display name and email */}
                <p className='profile-info'>{auth.currentUser.displayName}</p>
                <p className='profile-info'>{auth.currentUser.email}</p>

                {/* Change Password section */}
                <h2 id="change-pass-title">Change Password</h2>
                <div>
                    <input
                        type="password"
                        id="current-password"
                        name="current-password"
                        onChange={(text) => setCurrentPassword(text.target.value)}
                        value={currentPassword}
                        required
                        placeholder="Current Password"
                    />
                    <br /><br />

                    <input
                        type="password"
                        id="new-password"
                        name="new-password"
                        onChange={(text) => setNewPassword(text.target.value)}
                        value={newPassword}
                        required
                        placeholder="New Password"
                    />
                    <br /><br />

                    <input
                        type="password"
                        id="confirm-password"
                        name="confirm-password"
                        onChange={(text) => setConfirmNewPassword(text.target.value)}
                        value={confirmNewPassword}
                        onBlur={validateNewPassword}
                        required
                        placeholder="Confirm Password"
                    />
                    <br /><br />

                    {/* Button to change password */}
                    <input id="change-pass-button" type="submit" value="Change Password" onClick={handleChangePassword} />
                </div>
            </section>

            {/* Delete Account section */}
            <section className="account-settings" id="delete-acct">
                <button onClick={handleConfirmationMessage}>Delete Account</button>
            </section>
        </div>
    );
}
