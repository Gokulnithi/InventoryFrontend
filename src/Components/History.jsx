import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  CircularProgress,
  Box,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import useUser from "../hooks/useUser";

const baseOptions = ["base1", "base2", "base3"];

const History = () => {
  const { user, userLoading, userError } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [baseFilter, setBaseFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [startDate, setStartDate] = useState(""); // ✅ new state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.base) {
      setBaseFilter(user.base);
    }
  }, [user]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/transactions`);
        setTransactions(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    let result = transactions;

    if (baseFilter) {
      result = result.filter(
        (tx) =>
          tx.base === baseFilter ||
          tx.fromBase === baseFilter ||
          tx.toBase === baseFilter
      );
    }

    if (typeFilter) {
      result = result.filter((tx) => tx.type === typeFilter);
    }

    if (startDate) {
      const start = new Date(startDate);
      result = result.filter((tx) => {
        const txDate = new Date(tx.date);
        return txDate >= start;
      });
    }

    setFiltered(result);
  }, [baseFilter, typeFilter, startDate, transactions]);

  if (userLoading || loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading transaction history...
        </Typography>
      </Container>
    );
  }

  if (userError || !user) {
    return (
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h6" color="error">
          Unable to load user info. Please log in again.
        </Typography>
      </Container>
    );
  }

  const { role } = user;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Transaction History
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4, flexWrap: "wrap" }}>
        {(role === "admin" || role === "commander") && (
          <TextField
            label="Filter by Base"
            select
            value={baseFilter}
            onChange={(e) => setBaseFilter(e.target.value)}
            variant="outlined"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            {baseOptions.map((base) => (
              <MenuItem key={base} value={base}>
                {base}
              </MenuItem>
            ))}
          </TextField>
        )}

        <TextField
          label="Filter by Type"
          select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          variant="outlined"
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="purchase">Purchase</MenuItem>
          <MenuItem value="transfer">Transfer</MenuItem>
          <MenuItem value="assignment">Assignment</MenuItem>
          <MenuItem value="expended">Expended</MenuItem>
          <MenuItem value="returned">Returned</MenuItem>
        </TextField>

        {/* ✅ Date Filter */}
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          sx={{ minWidth: 180 }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{ maxWidth: 1200, margin: "0 auto", boxShadow: 6 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Item Name</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Base</strong></TableCell>
              <TableCell><strong>From</strong></TableCell>
              <TableCell><strong>To</strong></TableCell>
              <TableCell><strong>Count</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Username</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((tx) => (
                <TableRow key={tx._id}>
                  <TableCell>{tx.itemName}</TableCell>
                  <TableCell>{tx.type}</TableCell>
                  <TableCell>{tx.base || "-"}</TableCell>
                  <TableCell>{tx.type === "transfer" ? tx.base : "-"}</TableCell>
                  <TableCell>{tx.toBase || "-"}</TableCell>
                  <TableCell>{tx.count != null ? tx.count : "-"}</TableCell>
                  <TableCell>
                    {tx.date ? new Date(tx.date).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>{tx.username || "-"}</TableCell>
                  <TableCell>{tx.role || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No History
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default History;
