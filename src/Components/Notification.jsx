import React, { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Notification = () => {
  const [dueItems, setDueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const base = localStorage.getItem("base");

  useEffect(() => {
    if (!base) return;

    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/notifications/due/${base}`)
      .then((res) => {
        setDueItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching notifications:", err);
        setLoading(false);
      });
  }, [base]);
  useEffect(() => {
    if (dueItems.length > 0) {
      localStorage.setItem("hasNotifications", "true");
    } else {
      localStorage.setItem("hasNotifications", "false");
    }
  }, [dueItems]);

  const handleClick = (itemId) => {
    navigate(`/product/${base}/${itemId}`);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : dueItems.length === 0 ? (
        <Typography variant="body1">No notifications to show.</Typography>
      ) : (
        <Paper elevation={3} sx={{ padding: 2 }}>
          <List>
            {dueItems.map((item, index) => (
              <ListItem
                key={index}
                button
                onClick={() => handleClick(item.itemId)}
                sx={{ cursor: "pointer" }}
              >
                <ListItemText
                  primary={`Return due for ${item.itemName} (Assigned to: ${item.assignedTo})`}
                  secondary={`Return Date: ${new Date(
                    item.dateReturn
                  ).toLocaleDateString()} | Count: ${item.count}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default Notification;
