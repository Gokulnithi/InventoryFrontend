import React, { useEffect, useState } from "react";
import axios from "axios";
import Products from "../Components/Products";
import {
  CircularProgress,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Container,
} from "@mui/material";

const Home = () => {
  const [data, setData] = useState({});
  const [role, setRole] = useState("");
  const [username, setUsername] = useState(""); // ✅ new state
  const [availableBases, setAvailableBases] = useState([]);
  const [selectedBase, setSelectedBase] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/userinfo/me`,
          { withCredentials: true }
        );

        const { user, bases } = response.data;

        setRole(user.role);
        setUsername(user.name);
        setData(bases);

        const baseKeys = Object.keys(bases);
        setAvailableBases(baseKeys);

        const storedBase = localStorage.getItem("selectedBase");
        const defaultBase = baseKeys.includes(storedBase)
          ? storedBase
          : baseKeys.includes(user.base)
          ? user.base
          : baseKeys[0];

        setSelectedBase(defaultBase);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleBaseChange = (event) => {
    const newBase = event.target.value;
    setSelectedBase(newBase);
    localStorage.setItem("selectedBase", newBase);
  };

  const selectedBaseData = selectedBase ? data[selectedBase] : [];

  return (
    <>
      {loading ? (
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <CircularProgress sx={{ color: "#1976d2" }} />
        </Box>
      ) : (
        <Container
          maxWidth="lg"
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* ✅ Welcome Message */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Welcome, {username}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Please select a base to view its inventory
            </Typography>
          </Box>

          {/* ✅ Base Selector */}
          <Box sx={{ mb: { xs: 3, sm: 4 } }}>
            <Typography variant="h6" gutterBottom>
              Select Base
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="base-select-label">Base</InputLabel>
              <Select
                labelId="base-select-label"
                value={selectedBase}
                label="Base"
                onChange={handleBaseChange}
              >
                {availableBases.map((base) => (
                  <MenuItem key={base} value={base}>
                    {base}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Products data={selectedBaseData} baseName={selectedBase} />
        </Container>
      )}
    </>
  );
};

export default Home;
