import '../../styles/auth.css'

const PasswordResetPage = () => {
  return (
    <div className="container">
      <h2>
        Film<span id="title-force">Force</span> Password Reset
      </h2>
      <form action="#" method="POST">
        <input type="email" id="email" name="email" required placeholder="Email" /><br />
        <input type="submit" value="Reset Password" />
      </form>

      <p className="account-options">
        <a href="./login.html">Remember your password? Login here.</a>
      </p>
      <p className="account-options">
        <a href="./signup.html">Don&apos;t have an account? Sign up now.</a>
      </p>
    </div>
  );
};

export default PasswordResetPage;
