import '../../styles/auth.css'

const SignupPage = () => {
  return (
    <div className="container">
      <h2>
        Film<span id="title-force">Force</span> Signup
      </h2>
      <form action="#" method="POST">
        <input type="email" id="email" name="email" required placeholder="Email" /><br />
        <input type="username" id="username" name="username" required placeholder="Username" /><br />
        <input type="password" id="password" name="password" required placeholder="Password" /><br />
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          required
          placeholder="Confirm Password"
        /><br />
        <input type="date" id="birthday" name="birthday" required placeholder="Birthday" /><br />
        <input type="submit" value="Create Account" />
      </form>

      <p className="account-options">
        <a href="./login.html">Already have an account? Login here.</a>
      </p>
      <p className="account-options">
        <a href="./passwordReset.html">Forgot Password?</a>
      </p>
    </div>
  );
};

export default SignupPage;
