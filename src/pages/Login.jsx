import { useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword(form);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 10 }}>
        <Typography variant="h4" gutterBottom>
          FleetFlow Login
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          name="email"
          label="Email"
          onChange={handleChange}
        />

        <TextField
          fullWidth
          margin="normal"
          name="password"
          type="password"
          label="Password"
          onChange={handleChange}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Typography sx={{ mt: 3 }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ textDecoration: "none" }}>
            Register here
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;