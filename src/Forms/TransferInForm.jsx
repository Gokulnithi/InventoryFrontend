import React, { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Autocomplete,
  CircularProgress
} from "@mui/material";
import { itemNames } from "../Constans/comps";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import useUser from "../hooks/useUser";

const TransferInForm = () => {
  const { user, userLoading, userError } = useUser();

  const [selectedItem, setSelectedItem] = useState('');
  const [fromBase, setFromBase] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [count, setCount] = useState('');
  const [loading, setLoading] = useState(false);

  const baseOptions = ["base1", "base2", "base3"];
  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!selectedItem || !fromBase || !receivedDate || !count) {
      toast.warning("Please fill all fields", { toastId: "transfer-fields" });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const receivedDt = new Date(receivedDate);

    if (receivedDt < today) {
      toast.error("Received date cannot be in the past", { toastId: "transfer-date" });
      return;
    }

    if (userLoading) {
      toast.error("User info is still loading. Please wait...", { toastId: "user-loading" });
      return;
    }

    if (userError || !user?.name || !user?.base) {
      toast.error("User info not available. Please log in again.", { toastId: "user-error" });
      return;
    }

    const payload = {
      username: user.name,
      itemName: selectedItem,
      fromBase: fromBase,
      toBase: user.base,
      count: parseInt(count),
      receivedDate: receivedDate
    };

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/inventory/transferin`, payload, {
        withCredentials: true
      });

      toast.success("Item transferred successfully", { toastId: "transfer-success" });

      setSelectedItem('');
      setFromBase('');
      setReceivedDate('');
      setCount('');
    } catch (err) {
      console.error("Transfer In failed:", err);
      toast.error(err.response?.data?.message || "Failed to transfer item", {
        toastId: "transfer-error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer 
        position="top-right"
        theme="colored"
        limit={1}
        autoClose={2500}
        pauseOnHover={false}
        closeOnClick
      />

      <Stack spacing={2}>
        <Autocomplete
          options={itemNames}
          value={selectedItem}
          onChange={(event, newValue) => setSelectedItem(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Item Name" fullWidth />
          )}
          fullWidth
          clearOnEscape
        />

        <Autocomplete
          options={baseOptions}
          value={fromBase}
          onChange={(event, newValue) => setFromBase(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="From Base" fullWidth />
          )}
          fullWidth
          clearOnEscape
        />

        <TextField
          label="Count"
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          fullWidth
        />

        <TextField
          label="Received Date"
          type="date"
          value={receivedDate}
          onChange={(e) => setReceivedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: todayStr }}
          fullWidth
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? "Transferring..." : "Confirm Transfer In"}
        </Button>
      </Stack>
    </>
  );
};

export default TransferInForm;
