import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import '../firebase';
import { Button, TextField, Typography, Box, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Create custom Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#FFC107',
    },
    secondary: {
      main: '#DFA805',
    },
  },
  typography: {
    fontFamily: `'Titillium Web', 'sans-serif'`,
  },
});

// login
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const auth = getAuth();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User details:", user);
      window.location.href = '../TodoApp';
    } catch (err) {
      console.log(err.message)
      setError("Oops! We couldn't find an account with that email or password. Double-check or create a new one");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="background.default"  sx={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../../public/images06.jpg')`,backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',}}>
        <Box sx={{ padding: 4, backgroundColor: '#212529', borderRadius: 2, maxWidth: 400, textAlign: 'center', }} >
          <Typography variant="h4"  style={{color :'#FFC107'}} gutterBottom>
            Login
          </Typography>
          {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
          <form onSubmit={handleLogin}>
            <TextField fullWidth margin="normal" variant="outlined" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required color="primary" sx={{ backgroundColor: 'white', color: 'black' }} />
            <TextField fullWidth margin="normal" variant="outlined" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required color="primary" sx={{ backgroundColor: 'white', color: 'black' }} />
            <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginY: 2, color:'white' }}> Login </Button>
          </form>
          <Typography color="white"> Don{`'`}t have an account? <Link to="../Sign" style={{ color: '#FFC107', textDecoration: 'none' }}>Sign Up</Link> </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
