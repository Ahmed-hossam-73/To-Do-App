import { Link } from 'react-router-dom';
import './Login.css';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import '../firebase';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// create color in Material Ui
const theme = createTheme({
  palette: {
    Dark: {
      main: 'rgba(255, 0, 0, 0)',
      contrastText: 'white',
    },
  },
});

export default function Login() {
  // make submit button login button
  const handleLogin = (event) => {
    event.preventDefault();
    login();
  };
  // check if inputs is valid or not
  const validateInput = (regex, value, element) => {
    const errorDiv = document.getElementById("error");
    if (!regex.test(value)) {
      element.classList.add("is-invalid");
      errorDiv.textContent = "Invalid input. Please enter valid details.";
    } else {
      element.classList.remove("is-invalid");
      errorDiv.textContent = "";
    }
  };

  return (
    <>
      <div className="container my-5 text-center">
        <div className="group m-auto w-75 p-5">
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <input className="form-control my-3" placeholder="Enter your email" type="text" id="email" onInput={(e) => validateInput(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, e.target.value, e.target)} />
            <input className="form-control my-3" placeholder="Enter your password" type="password" id="password" onInput={(e) => validateInput(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, e.target.value, e.target)}/>
            <div id="error" className="text-danger"></div>
            <ThemeProvider theme={theme}><Button variant="contained" color="Dark"className="btn btn-outline-dark text-white w-100 my-3" type="submit" onClick={login}>Login</Button></ThemeProvider>
          </form>
          <p className="text-white">
            Don{`'`}t have an account? <Link to="../Sign" className="text-white">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

const auth = getAuth();
// login
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  // sign in with fire auth code from the website 
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      window.location.href='../TodoApp'
      console.log("User details:", user);
    })
    .catch((error) => {
      const errorDiv = document.getElementById("error");
      errorDiv.textContent = `Error: ${error.message}`;
    });
}
