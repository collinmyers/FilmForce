import '../../styles/hub.css'
import { onAuthStateChanged, signOut, EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth } from '../../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    const navigate = useNavigate();

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
        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return;
    }

    const handleChangePassword = async () => {
        const user = auth.currentUser;

        try {
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential).then(() => {
                updatePassword(user, newPassword).then(() => {
                    alert("Password Updated")
                    user.reload();
                })
            });
        } catch (error) {
            console.error(error)
        }

    };

    const handleConfirmationMessage = () => {
        const isConfirmed = window.confirm('Are you sure you want to delete your account?');

        if (isConfirmed) {
            handleDelete();
        } else {
            return;
        }
    };

    const handleDelete = async () => {
        const user = auth.currentUser;

        try {
            await deleteUser(user);
            navigate("/")
            await signOut(auth)
            alert("Account Successfully Deleted");

        } catch (error) {
            console.error(error)
        }
    };

    const validateNewPassword = () => {
        if ((newPassword !== confirmNewPassword)) {
            alert("Password and Confirm Password Must Match");
            setNewPassword('');
            setConfirmNewPassword('');
        } else if (newPassword.length < 8 || confirmNewPassword.length < 8) {
            alert("Password Must Be at Least 8 Characters Long");
            setNewPassword('');
            setConfirmNewPassword('');
        }
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                navigate("/")
                setLoggedIn(false);
                auth.currentUser.reload();
            })
            .catch((error) => {
                console.error('Logout Error:', error);
            });
    };

    const handleEditReviews = () => {
        navigate(`/${auth.currentUser.uid}/UserReviews`)
    }

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
                        <li> <a onClick={handleLogout} id='logout'>Logout</a></li>
                    ) : (
                        <li><a href="/Login">Login</a></li>
                    )}
                </ul>
            </nav>

            <h1 className="account-settings" id="settings-title">Settings</h1>

            <button className='edit-reviews-goto' onClick={handleEditReviews}>Edit Reviews</button>

            <section className="account-settings" id="change-pass">
                <h2 id="acct-settings-title">Account Settings</h2>

                <p className='profile-info'>{auth.currentUser.displayName}</p>
                <p className='profile-info'>{auth.currentUser.email}</p>

                

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

                    <input id="change-pass-button" type="submit" value="Change Password" onClick={handleChangePassword} />
                </div>
            </section>

            <section className="account-settings" id="delete-acct">
                <button onClick={handleConfirmationMessage}>Delete Account</button>
            </section>

        </div>
    );
}