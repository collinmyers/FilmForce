import '../../styles/auth.css'

const PasswordResetPage = () => {
  return (
    <div className="container">
      <h2>
        Film<span id="title-force">Force</span> Password Reset
      </h2>
      <div>
        <input type="email" id="email" name="email" required placeholder="Email" /><br />
        <input type="submit" value="Reset Password" />
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
