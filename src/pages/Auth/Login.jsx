// import React from 'react';
import '../../styles/auth.css'

const LoginPage = () => {
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
          required
          placeholder="Email"
        /><br />
        <input
          type="password"
          id="password"
          name="password"
          required
          placeholder="Password"
        /><br />
        <input type="submit" value="Login" />
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
