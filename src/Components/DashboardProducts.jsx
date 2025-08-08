import axios from "axios";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import useUser from "../hooks/useUser";

const baseOptions = ["base1", "base2", "base3"];

const DashboardProducts = () => {
  const { user, userLoading, userError } = useUser();

  const [selectedBase, setSelectedBase] = useState("");
  const [products, setProducts] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(new Date("2025-08-01"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.base) {
      setSelectedBase(user.base);
    }
  }, [user]);

  useEffect(() => {
    if (!selectedBase) return;
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/byBase/${selectedBase}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [selectedBase]);

  const filtered = products.filter((p) => {
    const matchesType = filterType ? p.category === filterType : true;
    const matchesSearch = searchTerm
      ? p.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;

    const dateInRange = (dateStr) => {
      if (!dateStr || !startDate) return false;
      const date = new Date(dateStr);
      const start = new Date(startDate);
      return date >= start;
    };

    const datesToCheck = [
      p.openingBalance?.date,
      p.purchased?.date,
      p.transferedIn?.date,
      p.transferedOut?.date,
      p.expended?.date,
      ...(p.assigned?.receiptants?.map((r) => r.dateAssigned) || []),
    ];

    const matchesDate = datesToCheck.some(dateInRange);

    return matchesType && matchesSearch && matchesDate;
  });

  if (userLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography mt={2}>Loading user info...</Typography>
      </Box>
    );
  }

  if (userError || !user) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="error">
          Unable to load user info. Please log in again.
        </Typography>
      </Box>
    );
  }

  const { role } = user;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Products in Base: {selectedBase || "None Selected"}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        {role === "admin" && (
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Select Base</InputLabel>
            <Select
              value={selectedBase}
              label="Select Base"
              onChange={(e) => setSelectedBase(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {baseOptions.map((base) => (
                <MenuItem key={base} value={base}>
                  {base}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={filterType}
            label="Filter by Category"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {[...new Set(products.map((p) => p.category))].map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
        />

        <TextField
          label="Start Date"
          type="date"
          value={startDate.toISOString().split("T")[0]}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 250 }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 4, minWidth: 250 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Item</strong></TableCell>
                <TableCell>Opening</TableCell>
                <TableCell>Purchased</TableCell>
                <TableCell>Transfer In</TableCell>
                <TableCell>Transfer Out</TableCell>
                <TableCell>Net Movement</TableCell>
                <TableCell>Assigned</TableCell>
                <TableCell>Expended</TableCell>
                <TableCell>Closing</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((product) => {
                const opening = product.openingBalance?.count ?? 0;
                const purchased = product.purchased?.count ?? 0;
                const transferIn = product.transferedIn?.count ?? 0;
                const transferOut = product.transferedOut?.count ?? 0;
                const assigned =
                  product.assigned?.receiptants?.reduce(
                    (sum, r) => sum + (r.count ?? 0),
                    0
                  ) ?? 0;
                const expended = product.expended?.count ?? 0;
                const netMovement = purchased + transferIn - transferOut;
                const closing = opening + netMovement - assigned - expended;

                return (
                  <TableRow key={product._id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{opening}</TableCell>
                    <TableCell>{purchased}</TableCell>
                    <TableCell>{transferIn}</TableCell>
                    <TableCell>{transferOut}</TableCell>
                    <TableCell>{netMovement}</TableCell>
                    <TableCell>{assigned}</TableCell>
                    <TableCell>{expended}</TableCell>
                    <TableCell>{closing}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default DashboardProducts;
