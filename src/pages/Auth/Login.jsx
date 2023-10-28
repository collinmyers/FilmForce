import { useState } from 'react';
import '../../styles/auth.css';
import { auth } from '../../../services/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password).then(() => {
                navigate('/');
            });
        } catch (error) {
            alert("Incorrect email or password")
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    };

    return (
        <div className="container">
            <h2>
                Film<span id="title-force">Force</span> Login
            </h2>
            <div>
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
                <input type="submit" value="Login" onClick={handleLogin} />
            </div>

            <p className="account-options">
                <a href="/Signup">Don&apos;t have an account?</a>
            </p>
            <p className="account-options">
                <a href="/PasswordReset">Forgot Password?</a>
            </p>
        </div>
    );
};

export default LoginPage;
