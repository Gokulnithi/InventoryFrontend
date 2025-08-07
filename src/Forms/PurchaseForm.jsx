import React, { useState } from 'react';
import { TextField, Button, Stack, Autocomplete, CircularProgress } from '@mui/material';
import { itemNames } from "../Constans/comps";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PurchaseForm = () => {
  const user = localStorage.getItem("username");
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [receivedDate, setReceivedDate] = useState('');
  const [loading, setLoading] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!selectedItem || !quantity || !receivedDate) {
      toast.dismiss();
      toast.warning("Please fill all fields", { toastId: "form-warning" });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const receivedDt = new Date(receivedDate);

    if (receivedDt < today) {
      toast.dismiss();
      toast.error("Received date cannot be in the past", { toastId: "date-error" });
      return;
    }

    const payload = {
      username: user,
      name: selectedItem,
      count: parseInt(quantity),
      date: receivedDate
    };

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/inventory/purchase`, payload, {
        withCredentials: true
      });

      setSelectedItem('');
      setQuantity('');
      setReceivedDate('');
    } catch (err) {
      console.error("Error submitting purchase:", err);
      toast.dismiss();
      toast.error("Failed to record purchase", { toastId: "purchase-error" });
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

        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
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
          {loading ? "Submitting..." : "Submit Purchase"}
        </Button>
      </Stack>
    </>
  );
};

export default PurchaseForm;
