import '../../styles/auth.css';
import { auth } from '../../../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function SignupPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        try {
            await createUserWithEmailAndPassword(auth, email, password).then(() => {
                updateProfile(auth.currentUser, { displayName: fullName });
                navigate('/Login');
            });
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    };


    const validatePassword = () => {
        if ((password !== confirmPassword)) {
            alert("Password and Confirm Password Must Match");
            setPassword('');
            setConfirmPassword('');
        } else if (password.length < 8 || confirmPassword.length < 8) {
            alert("Password Must Be at Least 8 Characters Long");
            setPassword('');
            setConfirmPassword('');
        }
    }

    return (
        <div className="container">
            <h2>
                Film<span id="title-force">Force</span> Signup
            </h2>
            <div>
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
                <input type="submit" value="Create Account" onClick={handleSignUp} />
            </div>

            <p className="account-options">
                <a href="./login">Already have an account?</a>
            </p>
            <p className="account-options">
                <a href="./PasswordReset">Forgot Password?</a>
            </p>
        </div>
    );
}
