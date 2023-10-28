import '../../styles/auth.css';
import { auth } from '../../../services/firebaseConfig';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
const PasswordResetPage = () => {
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const handlePasswordReset = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            await sendPasswordResetEmail(auth, email).then(() => {
                navigate("/Login")
            })
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    }

    const validateEmail = () => {
        const emailFormat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!emailFormat.test(email)) {
            alert("Invalid Email Format");
            setEmail('');
        }
    }

    return (
        <div className="container">
            <h2>
                Film<span id="title-force">Force</span> Password Reset
            </h2>
            <div>
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
                <input
                    type="submit"
                    value="Reset Password"
                    onClick={handlePasswordReset}
                />
            </div>

            <p className="account-options">
                <a href="/Login">Remember your password?</a>
            </p>
            <p className="account-options">
                <a href="/Signup">Don&apos;t have an account?</a>
            </p>
        </div>
    );
};

export default PasswordResetPage;
