import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
} from "@mui/material";

const roles = ["admin", "commander", "user"];
const bases = ["base1", "base2", "base3"];

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [base, setBase] = useState("base1");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = {
      username: username,
      password: password,
      role: role,
      base: base,
    };
    try {
      if (!username || !password || !role || !base) {
        throw new Error("Invalid Credentials");
      }
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        payload,
        { withCredentials: true }
      );
      toast.success("Signup successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(`${err.response.data.message}`);
      console.log(err.response.data);
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
            Signup
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <TextField
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
            >
              {roles.map((val) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Base"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              fullWidth
            >
              {bases.map((val) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained" fullWidth>
              Signup
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}
