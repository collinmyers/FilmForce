// Import necessary styles and dependencies
import '../../styles/auth.css';
import { auth } from '../../../services/firebaseConfig';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Define the PasswordResetPage component
const PasswordResetPage = () => {
    // State variable to store the user's email
    const [email, setEmail] = useState('');

    // Initialize the navigate function from react-router-dom
    const navigate = useNavigate();

    // Handle the password reset request when the "Reset Password" button is clicked
    const handlePasswordReset = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            // Use Firebase authentication to send a password reset email
            await sendPasswordResetEmail(auth, email).then(() => {
                // Redirect to the login page after the password reset email is sent
                navigate("/Login");
            });
        } catch (error) {
            // Handle any errors that occur during the password reset process
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    }

    // Validate the email format when the email input field loses focus
    const validateEmail = () => {
        const emailFormat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!emailFormat.test(email)) {
            // Display an alert for an invalid email format and reset the email input
            alert("Invalid Email Format");
            setEmail('');
        }
    }

    // Render the password reset form using JSX
    return (
        <div className="container">
            <h2>
                Film<span id="title-force">Force</span> Password Reset
            </h2>
            <div>
                {/* Input field for email */}
                <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={(text) => setEmail(text.target.value)}
                    onBlur={validateEmail}
                    value={email}
                    required
                    placeholder="Email"
                />
                <br />

                {/* Button triggering the handlePasswordReset function */}
                <input
                    type="submit"
                    value="Reset Password"
                    onClick={handlePasswordReset}
                />
            </div>

            {/* Links for account options (login and sign up) */}
            <p className="account-options">
                <a href="/Login">Remember your password?</a>
            </p>
            <p className="account-options">
                <a href="/Signup">Don&apos;t have an account?</a>
            </p>
        </div>
    );
};

// Export the PasswordResetPage component as the default export
export default PasswordResetPage;
