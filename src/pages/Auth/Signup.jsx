// Import necessary styles and dependencies
import '../../styles/auth.css';
import { auth } from '../../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

// Define the SignupPage component
export default function SignupPage() {
    // Initialize the navigate function from react-router-dom
    const navigate = useNavigate();

    // State variables to store user input values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');

    // Handle the signup attempt when the "Create Account" button is clicked
    const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            // Use Firebase authentication to create a new user with email and password
            await createUserWithEmailAndPassword(auth, email, password).then(() => {
                // Update the user profile with the provided full name
                updateProfile(auth.currentUser, { displayName: fullName });
                // Redirect to the login page after successful signup
                navigate('/Login');
            });
        } catch (error) {
            // Handle any errors that occur during the signup process
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    };

    // Validate password and confirm password fields
    const validatePassword = () => {
        if (password !== confirmPassword) {
            // Display an alert if password and confirm password do not match
            alert("Password and Confirm Password Must Match");
            setPassword('');
            setConfirmPassword('');
        } else if (password.length < 8 || confirmPassword.length < 8) {
            // Display an alert if the password is less than 8 characters long
            alert("Password Must Be at Least 8 Characters Long");
            setPassword('');
            setConfirmPassword('');
        }
    }

    // Render the signup form using JSX
    return (
        <div className="container">
            <h2>
                Film<span id="title-force">Force</span> Signup
            </h2>
            <div>
                {/* Input fields for full name, email, password, and confirm password */}
                <input
                    type="fullName"
                    id="fullName"
                    name="fullName"
                    onChange={(text) => setFullName(text.target.value)}
                    value={fullName}
                    required
                    placeholder="Full Name"
                />
                <br />
                <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={(text) => setEmail(text.target.value)}
                    value={email}
                    onBlur={validatePassword}
                    required
                    placeholder="Email"
                />
                <br />
                <input
                    type="password"
                    id="password"
                    name="password"
                    onChange={(text) => setPassword(text.target.value)}
                    value={password}
                    required
                    placeholder="Password"
                />
                <br />
                <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    onChange={(text) => setConfirmPassword(text.target.value)}
                    value={confirmPassword}
                    onBlur={validatePassword}
                    required
                    placeholder="Confirm Password" />
                <br />

                {/* Button triggering the handleSignUp function */}
                <input type="submit" value="Create Account" onClick={handleSignUp} />
            </div>

            {/* Links for account options (login and password reset) */}
            <p className="account-options">
                <a href="./login">Already have an account?</a>
            </p>
            <p className="account-options">
                <a href="./PasswordReset">Forgot Password?</a>
            </p>
        </div>
    );
}
