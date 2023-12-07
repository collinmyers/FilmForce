// Import necessary hooks and dependencies from React and Firebase
import { useState } from 'react';
import '../../styles/auth.css';
import { auth } from '../../../services/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Define the LoginPage component
const LoginPage = () => {
    // Initialize the navigate function from react-router-dom
    const navigate = useNavigate();

    // State variables to store email and password input values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Handle login attempt when the login button is clicked
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Use Firebase authentication to sign in with email and password
            await signInWithEmailAndPassword(auth, email, password).then(() => {
                // Redirect to the home page upon successful login
                navigate('/');
            });
        } catch (error) {
            // Handle login failure, display alert, and log error details
            alert("Incorrect email or password")
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    };

    // Render the login form using JSX
    return (
        <div className="container">
            <h2>
                Film<span id="title-force">Force</span> Login
            </h2>
            <div>
                {/* Input fields for email and password */}
                <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={(text) => setEmail(text.target.value)}
                    value={email}
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

                {/* Login button triggering the handleLogin function */}
                <input type="submit" value="Login" onClick={handleLogin} />
            </div>

            {/* Links for account options (sign up and password reset) */}
            <p className="account-options">
                <a href="/Signup">Don&apos;t have an account?</a>
            </p>
            <p className="account-options">
                <a href="/PasswordReset">Forgot Password?</a>
            </p>
        </div>
    );
};

// Export the LoginPage component as the default export
export default LoginPage;
