import { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import '../firebase';
import { Button, TextField, Box, Typography, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Custom Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#FFC107',
    },
    secondary: {
      main: '#DFA805',
    },
  },
});

export default function Sign() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const auth = getAuth();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form input
  const validateInput = (regex, value) => regex.test(value);

  const handleSignup = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Validate form fields
    if (!validateInput(/^[A-z]{3,}$/, formData.name)) {
      setError("Invalid name. Minimum 3 characters required.");
      return;
    }
    if (!validateInput(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, email)) {
      setError("Invalid email format.");
      return;
    }
    if (!validateInput(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, password)) {
      setError("Password must be at least 8 characters with uppercase, lowercase, number, and special character.");
      return;
    }

    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User details:", user);
      window.location.href = "../login";
    } catch (err) {
      console.log(err.message)
      setError("This Email have an account already");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="background.default"  sx={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../../public/images06.jpg')`,backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',}}>
        <Box sx={{padding: 4, backgroundColor: '#212529', borderRadius: 2, maxWidth: 400, textAlign: 'center', }} >
          <Typography variant="h4" style={{color :'#FFC107'}} gutterBottom> Sign Up </Typography>
          {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
          <form onSubmit={handleSignup}>
            <TextField fullWidth margin="normal" label="Name" name="name" variant="outlined" value={formData.name} onChange={handleChange} color="primary" required  sx={{ backgroundColor: 'white', color: 'black' }} />
            <TextField fullWidth margin="normal" label="Email" name="email" type="email" variant="outlined" value={formData.email} onChange={handleChange} color="primary" required  sx={{ backgroundColor: 'white', color: 'black' }} />
            <TextField fullWidth margin="normal" label="Password" name="password" type="password" variant="outlined" value={formData.password} onChange={handleChange} color="primary" required  sx={{ backgroundColor: 'white', color: 'black' }} />
            <Button variant="contained" color="primary" fullWidth type="submit" sx={{ marginY: 2 }} > Sign Up </Button>
          </form>
          <Typography color="white"> Already have an account? <Link to="../Login" style={{ color: '#FFC107', textDecoration: 'none' }}>Login</Link> </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
