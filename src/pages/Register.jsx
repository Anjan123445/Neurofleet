import { useState } from "react";
import { supabase } from "../supabaseClient";
import {
  Container,
  TextField,
  Button,
  Typography,
  MenuItem,
  Box,
  Paper
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    role: "customer"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    });

    if (error) {
      alert(error.message);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        full_name: form.full_name,
        phone: form.phone,
        role: form.role
      }
    ]);

    if (profileError) {
      alert(profileError.message);
      return;
    }

    alert("Registered successfully!");
    navigate("/login");
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Create Account
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          name="full_name"
          label="Full Name"
          onChange={handleChange}
        />

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

        <TextField
          fullWidth
          margin="normal"
          name="phone"
          label="Phone"
          onChange={handleChange}
        />

        <TextField
          select
          fullWidth
          margin="normal"
          name="role"
          label="Select Role"
          value={form.role}
          onChange={handleChange}
        >
          <MenuItem value="customer">Customer</MenuItem>
          <MenuItem value="driver">Driver</MenuItem>
          <MenuItem value="fleet_manager">Fleet Manager</MenuItem>
        </TextField>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRegister}
        >
          Register
        </Button>

        <Typography sx={{ mt: 3 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: "none" }}>
            Login here
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Register;