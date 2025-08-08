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
import useUser from "../hooks/useUser"; // ✅ Import the hook

const Notification = () => {
  const { user, userLoading, userError } = useUser(); // ✅ Use the hook
  const [dueItems, setDueItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.base) return;

      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/notifications/due/${user.base}`
        );
        setDueItems(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);


  const handleClick = (itemId) => {
    navigate(`/product/${user.base}/${itemId}`);
  };

  if (userLoading || loading) {
    return (
      <Box sx={{ padding: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Loading notifications...</Typography>
      </Box>
    );
  }

  if (userError || !user) {
    return (
      <Box sx={{ padding: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Unable to load user info. Please log in again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>

      {dueItems.length === 0 ? (
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
