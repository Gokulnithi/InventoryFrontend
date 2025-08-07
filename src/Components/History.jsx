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

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [baseFilter, setBaseFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const baseOptions = ["base1", "base2", "base3"];

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
    setFiltered(result);
  }, [baseFilter, typeFilter, transactions]);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading transaction history...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Transaction History
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
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
      </Box>

      <TableContainer
        component={Paper}
        sx={{ maxWidth: 1200, margin: "0 auto", boxShadow: 6 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>Item Name</TableCell>
              <TableCell sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>Type</TableCell>
              <TableCell sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>Base</TableCell>
              <TableCell sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>From</TableCell>
              <TableCell sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>To</TableCell>
              <TableCell sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>Count</TableCell>
              <TableCell sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>Username</TableCell>
              <TableCell sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>Role</TableCell>
            </TableRow>
          </TableHead>
          {filtered.length > 0 ? (
            <TableBody>
              {filtered.map((tx) => (
                <TableRow key={tx._id}>
                  <TableCell sx={{ fontSize: "1rem" }}>{tx.itemName}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{tx.type}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{tx.base || "-"}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{tx.type === "transfer" ? tx.base : "-"}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{tx.toBase || "-"}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{tx.count != null ? tx.count : "-"}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>
                    {tx.date ? new Date(tx.date).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{tx.username || "-"}</TableCell>
                  <TableCell sx={{ fontSize: "1rem" }}>{tx.role || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ fontSize: "1rem" }}>
                  No History
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Container>
  );
};

export default History;
