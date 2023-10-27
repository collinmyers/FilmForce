import '../../styles/auth.css'
import { auth } from '../../../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
 
    const onSubmit = async (e) => {
      e.preventDefault()
     
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          navigate("./login.html")
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          // ..
        });
 
    }

  return (
    <div className="container">
      <h2>
        Film<span id="title-force">Force</span> Signup
      </h2>
      <form action="#" method="POST">
        <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} required placeholder="Email" /><br />
        <input type="username" id="username" name="username" required placeholder="Username" /><br />
        <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required placeholder="Password" /><br />
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          required
          placeholder="Confirm Password"
        /><br />
        <input type="date" id="birthday" name="birthday" required placeholder="Birthday" /><br />
        <input type="submit" value="Create Account" onClick={onSubmit} />
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
