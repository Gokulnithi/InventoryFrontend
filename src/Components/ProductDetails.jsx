import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import useUser from "../hooks/useUser"; // ✅ Import the hook

const ProductDetails = () => {
  const { base, id } = useParams();
  const { user, userLoading, userError } = useUser(); // ✅ Use the hook

  const [product, setProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [returnedCount, setReturnedCount] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/${base}/${id}`,
          {
            withCredentials: true,
          }
        );
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [base, id]);

  const handleOpenModal = (assignment) => {
    setSelectedAssignment(assignment);
    setReturnedCount("");
    setOpenModal(true);
  };

  const handleSubmitReturn = async () => {
    const returned = parseInt(returnedCount);
    const assigned = selectedAssignment.count;
    const expended = assigned - returned;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/inventory/${base}/${id}/returned`,
        {
          returnedCount: returned,
          expendedCount: expended,
          receiptantId: selectedAssignment._id,
          username: user?.name,
          role: user?.role,
        },
        { withCredentials: true }
      );

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/${base}/${id}`,
        {
          withCredentials: true,
        }
      );
      setProduct(res.data);
      setOpenModal(false);
    } catch (err) {
      console.error("Error submitting return:", err);
    }
  };

  if (userLoading || !product) {
    return (
      <Container sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading product details...
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

  const {
    name,
    category,
    image,
    openingBalance,
    purchased,
    transferedIn,
    transferedOut,
    assigned,
    expended,
  } = product;

  const receiptants = assigned?.receiptants ?? [];
  const totalAssigned = receiptants.reduce((sum, r) => sum + (r.count ?? 0), 0);
  const netMovement =
    (purchased?.count ?? 0) +
    (transferedIn?.count ?? 0) -
    (transferedOut?.count ?? 0);
  const closingBalance =
    (openingBalance?.count ?? 0) +
    netMovement -
    totalAssigned -
    (expended?.count ?? 0);

  const dataPoints = [
    { label: "Opening Balance", value: openingBalance?.count ?? 0 },
    { label: "Purchased", value: purchased?.count ?? 0 },
    { label: "Transferred In", value: transferedIn?.count ?? 0 },
    { label: "Transferred Out", value: transferedOut?.count ?? 0 },
    { label: "Net Movement", value: netMovement },
    { label: "Assigned (Total)", value: totalAssigned },
    { label: "Expended", value: expended?.count ?? 0 },
    { label: "Closing Balance", value: closingBalance },
  ];

  return (
    <Container sx={{ mt: 4, width: "100vw" }}>
      <Card elevation={3}>
        <CardMedia
          component="img"
          image={image}
          alt={name}
          sx={{ objectFit: "contain", maxHeight: 400 }}
        />
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Category: {category}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Base: {base}
          </Typography>

          <Grid container spacing={2}>
            {dataPoints.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="h6">{item.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {receiptants.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Assignment Details
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {receiptants.map((r, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card variant="outlined" sx={{ minWidth: 350 }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Assigning To: {r.name}
                    </Typography>
                    <Typography variant="body2">Count: {r.count}</Typography>
                    <Typography variant="body2">
                      Assigned: {new Date(r.dateAssigned).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      Return: {new Date(r.dateReturn).toLocaleDateString()}
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={() => handleOpenModal(r)}
                    >
                      Mark Return
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Dialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Mark Returned Items</DialogTitle>
            <DialogContent dividers>
              {selectedAssignment && (
                <>
                  <Typography variant="body2" gutterBottom>
                    Recipient: {selectedAssignment.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Assigned Count: {selectedAssignment.count}
                  </Typography>
                  <TextField
                    label="Returned Count"
                    type="number"
                    fullWidth
                    value={returnedCount}
                    onChange={(e) => setReturnedCount(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  {returnedCount && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Expended:{" "}
                      {selectedAssignment.count - parseInt(returnedCount)}
                    </Typography>
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleSubmitReturn}>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default ProductDetails;
