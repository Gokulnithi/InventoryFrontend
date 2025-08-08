import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { username: email, password };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        payload,
        {
          withCredentials: true,
        }
      );

      localStorage.setItem("token", res.data.token);

      toast.success("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      toast.error("Login failed. Check credentials.");
      console.error(err);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        draggable
        theme="colored"
        limit={1}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: { xs: "90%", sm: 400 } }}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Username"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
            <Typography variant="body2" align="center">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
