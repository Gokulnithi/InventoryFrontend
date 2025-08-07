import React from "react";
import PurchaseForm from "../Forms/PurchaseForm";
import AssignedForm from "../Forms/AssignedForm";
import TransferInForm from "../Forms/TransferInForm";
import DashboardProducts from "./DashboardProducts";
// Removed TransferOutForm import
import { Box, Typography, Grid, Paper } from "@mui/material";

const Dashboard = () => {
  const role = localStorage.getItem("role");
  const base = localStorage.getItem("base");
  const canAccess = {
    purchase: ["admin", "commander", "user"],
    assigned: ["admin", "commander"],
    transferIn: ["admin", "commander", "user"],
    // transferOut removed from access map
  };

  const renderForm = (title, Component) => (
    <Grid item xs={12} md={6}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
          minWidth: 300,
          borderRadius: 5,
        }}
      >
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
          }}
        >
          <Component />
        </Box>
      </Paper>
    </Grid>
  );

  return (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "40px",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <Box sx={{ width: "100%", mt: 5 }}>
        <Typography variant="h4" gutterBottom align="center">
          Inventory Overview
        </Typography>
        <DashboardProducts base={base} />
      </Box>

      <Typography variant="h4" gutterBottom>
        Actions
      </Typography>
      <Grid container spacing={3} justifyContent="center" alignContent="center">
        {canAccess.purchase.includes(role) &&
          renderForm("Purchase", PurchaseForm)}
        {canAccess.assigned.includes(role) &&
          renderForm("Assigned", AssignedForm)}
        {canAccess.transferIn.includes(role) &&
          renderForm("Transfer In", TransferInForm)}
        {/* Transfer Out intentionally excluded */}
      </Grid>
    </Box>
  );
};

export default Dashboard;
