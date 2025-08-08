import React, { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { itemNames } from "../Constans/comps";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useUser from "../hooks/useUser";

const AssignedForm = () => {
  const { user, userLoading, userError } = useUser();

  const [selectedItem, setSelectedItem] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [count, setCount] = useState("");
  const [assignmentDate, setAssignmentDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (
      !selectedItem ||
      !assignedTo ||
      !count ||
      !assignmentDate ||
      !returnDate
    ) {
      toast.error("Please fill all fields", { toastId: "assign-fields" });
      return;
    }

    const assignDate = new Date(assignmentDate);
    const returnDt = new Date(returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (assignDate < today) {
      toast.error("Assignment date cannot be in the past", {
        toastId: "assign-date",
      });
      return;
    }

    if (returnDt < today) {
      toast.error("Return date cannot be in the past", {
        toastId: "return-date",
      });
      return;
    }

    if (returnDt <= assignDate) {
      toast.error("Return date must be after assignment date", {
        toastId: "date-order",
      });
      return;
    }

    if (userLoading) {
      toast.error("User info is still loading. Please wait...", {
        toastId: "user-loading",
      });
      return;
    }

    if (userError || !user?.name) {
      toast.error("User info not available. Please log in again.", {
        toastId: "user-error",
      });
      return;
    }

    const payload = {
      username: user.name,
      name: selectedItem,
      toname: assignedTo,
      count: parseInt(count),
      date: assignmentDate,
      dateR: returnDate,
    };

    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/inventory/assigned`,
        payload,
        {
          withCredentials: true,
        }
      );

      toast.success("Item assigned successfully", {
        toastId: "assign-success",
      });

      setSelectedItem("");
      setAssignedTo("");
      setCount("");
      setAssignmentDate("");
      setReturnDate("");
    } catch (err) {
      console.error("Error assigning item:", err);
      toast.error(err.response?.data?.message || "Failed to assign item", {
        toastId: "assign-error",
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
        closeOnClick={true}
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
          label="Assigned To"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          fullWidth
        />

        <TextField
          label="Count"
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          fullWidth
        />

        <TextField
          label="Assignment Date"
          type="date"
          value={assignmentDate}
          onChange={(e) => setAssignmentDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: todayStr }}
          fullWidth
        />

        <TextField
          label="Return Date"
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          inputProps={{ min: todayStr }}
          fullWidth
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {loading ? "Assigning..." : "Assign Item"}
        </Button>
      </Stack>
    </>
  );
};

export default AssignedForm;
