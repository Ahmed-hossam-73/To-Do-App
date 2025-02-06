import { Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
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

export default function Sign() {
  // change submit to login  
  const handleSignup = (event) => {
    event.preventDefault();
    signup();
  };
  // check inputs valid 
  const validate = (regex, value, element) => {
    const errorDiv = document.getElementById("error");
    if (!regex.test(value)) {
      element.classList.add("is-invalid");
      errorDiv.textContent = "Invalid input. Please follow the required pattern.";
    } else {
      element.classList.remove("is-invalid");
      errorDiv.textContent = "";
    }
  };

  return (
    <>
      <div className="container my-5 text-center">
        <div className="group m-auto w-75 p-5">
          <h1>Sign Up</h1>
          <form onSubmit={handleSignup}>
            <input className="form-control my-3" placeholder="Enter your name" type="text" id="yourname" onInput={(e) => validate(/^[A-z]{3,}$/, e.target.value, e.target)} />
            <input className="form-control my-3" placeholder="Enter your email" type="email" id="email" onInput={(e) => validate(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, e.target.value, e.target)} />
            <input className="form-control my-3" placeholder="Enter your password" type="password" id="password" onInput={(e) => validate(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, e.target.value, e.target)} />
            <div id="error" className="text-danger"></div>
            <ThemeProvider theme={theme}><Button variant="contained" color="Dark"className="btn btn-outline-dark text-white w-100 my-3" type="submit">Sign Up</Button></ThemeProvider>
          </form>
          <p className="text-white">You have an account? <Link to='../Login' className="text-white">Login</Link></p>
        </div>
      </div>
    </>
  );
}

const auth = getAuth();
// sign up function
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  // sign up from fire base website
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;
      alert("Sign up successful!");
      console.log("User details:", user);
    })
    .catch((error) => {
      const errorDiv = document.getElementById("error");
      errorDiv.textContent = `Error: ${error.message}`;
    });
}

