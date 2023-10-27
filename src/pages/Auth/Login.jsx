// import React from 'react';
import '../../styles/auth.css'
import { auth } from '../../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
     
  const onLogin = (e) => {
      e.preventDefault();
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        navigate("./home.html")
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
      });
     
  }

  return (
    <div className="container">
      <h2>
        Film<span id="title-force">Force</span> Login
      </h2>
      <form action="#" method="POST">
        <input
          type="email"
          id="email"
          name="email"
          onChange={(e)=>setEmail(e.target.value)}
          required
          placeholder="Email"
        /><br />
        <input
          type="password"
          id="password"
          name="password"
          onChange={(e)=>setPassword(e.target.value)}
          required
          placeholder="Password"
        /><br />
        <input type="submit" value="Login" onClick={onLogin} href="../Main" />
      </form>

      <p className="account-options">
        <a href="./signup.html">Don&apos;t have an account?</a>
      </p>
      <p className="account-options">
        <a href="./passwordReset.html">Forgot Password?</a>
      </p>
    </div>
  );
};

export default LoginPage;
