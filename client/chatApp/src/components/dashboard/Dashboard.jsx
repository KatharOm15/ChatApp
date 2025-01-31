import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  TextField,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";

function Dashboard() {
  const userID = localStorage.getItem("userId");
  const [users, setUsers] = useState([]);
  const [acceptedUsers, setAcceptedUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingRequests, setPendingRequests] = useState([]);

  // 🔹 Fetch all users excluding the logged-in user
  useEffect(() => {
    axios
      .get(`http://localhost:3000/users?exclude=${userID}`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // 🔹 Fetch sent requests
  useEffect(() => {
    axios
      .get(`http://localhost:3000/users/sent/${userID}`)
      .then((response) => setSentRequests(response.data))
      .catch((error) => console.error("Error fetching sent requests:", error));
  }, []);

  // 🔹 Fetch pending friend requests
  useEffect(() => {
    axios
      .get(`http://localhost:3000/friend-requests/pending/${userID}`)
      .then((response) => setPendingRequests(response.data))
      .catch((error) => console.error("Error fetching pending requests:", error));
  }, [sentRequests, acceptedUsers]); // ✅ Refresh when requests change

  // 🔹 Fetch accepted friends
  useEffect(() => {
    axios
      .get(`http://localhost:3000/users/accepted/${userID}`)
      .then((response) => setAcceptedUsers(response.data))
      .catch((error) => console.error("Error fetching accepted friends:", error));
  }, [sentRequests, acceptedUsers]); // ✅ Auto-refresh on changes

  // 🔹 Send friend request
  const handleSendRequest = (user) => {
    console.log("Function called for user:", user._id); // Debugging
    console.log("Current sentRequests:", sentRequests);

    if (sentRequests.includes(user._id)) {
      alert("Friend request already sent!"); // ✅ Show alert if already sent
      return;
    }

    axios
      .post(`http://localhost:3000/friend-requests/send`, {
        from: userID,
        to: user._id,
      })
      .then(() => {
        setSentRequests([...sentRequests, user._id]); // ✅ Add to sent list
        alert("Friend request sent!");
        
        // ✅ Refresh pending requests
        axios
          .get(`http://localhost:3000/friend-requests/pending/${userID}`)
          .then((response) => setPendingRequests(response.data));
      })
      .catch((error) => console.error("Error sending request:", error));
  };

  // 🔹 Cancel friend request
  const handleCancelRequest = (id) => {
    axios
      .delete(`http://localhost:3000/friend-requests/cancel`, {
        data: { from: userID, to: id },
      })
      .then(() => {
        setSentRequests(sentRequests.filter((userId) => userId !== id));
      })
      .catch((error) => console.error("Error canceling request:", error));
  };

  // 🔹 Accept Friend Request
  const handleAcceptRequest = (user) => {
    axios
      .post(`http://localhost:3000/friend-requests/accept`, {
        from: user._id,
        to: userID,
      })
      .then(() => {
        setAcceptedUsers([...acceptedUsers, user]);
        setPendingRequests(pendingRequests.filter((u) => u._id !== user._id));

        // ✅ Refresh accepted friends
        axios
          .get(`http://localhost:3000/users/accepted/${userID}`)
          .then((response) => setAcceptedUsers(response.data));
      })
      .catch((error) => console.error("Error accepting request:", error));
  };

  // 🔹 Reject Friend Request
  const handleRejectRequest = (user) => {
    axios
      .post(`http://localhost:3000/friend-requests/reject`, {
        from: user._id,
        to: userID,
      })
      .then(() => {
        setPendingRequests(pendingRequests.filter((u) => u._id !== user._id));
      })
      .catch((error) => console.error("Error rejecting request:", error));
  };

  // 🔹 Filter users based on search input
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ padding: 4, width: "80%", margin: "auto", textAlign: "center" }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        User Dashboard
      </Typography>

      {/* Search Bar */}
      <TextField
        fullWidth
        label="Search Users"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 3 }}
      />

      {/* Users List */}
      <Grid container spacing={3}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Grid item xs={12} md={6} lg={4} key={user._id}>
              <Card sx={{ display: "flex", alignItems: "center", padding: 2 }}>
                <Avatar
                  alt={user.name}
                  src={user.avatar}
                  sx={{ width: 56, height: 56, marginRight: 2 }}
                />
                <CardContent>
                  <Typography variant="h6">{user.name}</Typography>
                  <Box sx={{ marginTop: 1 }}>
                    {sentRequests.includes(user._id) ? (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleCancelRequest(user._id)}
                      >
                        Cancel Request
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleSendRequest(user)}
                      >
                        Send Request
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ marginY: 2 }}>
            No users found.
          </Typography>
        )}
      </Grid>

      {/* Pending Friend Requests */}
      <Divider sx={{ marginY: 4 }} />
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Pending Friend Requests
      </Typography>
      <Grid container spacing={3}>
        {pendingRequests.map((user) => (
          <Grid item xs={12} md={4} key={user._id}>
            <Card sx={{ padding: 2, textAlign: "center" }}>
              <Avatar alt={user.name} src={user.avatar} sx={{ width: 56, height: 56, marginBottom: 2, marginX: "auto" }} />
              <CardContent>
                <Typography variant="h6">{user.name}</Typography>
                <Box sx={{ marginTop: 1 }}>
                  <Button variant="contained" color="success" size="small" sx={{ marginRight: 1 }} onClick={() => handleAcceptRequest(user)}>
                    Accept
                  </Button>
                  <Button variant="outlined" color="error" size="small" onClick={() => handleRejectRequest(user)}>
                    Reject
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Accepted Users */}
      <Divider sx={{ marginY: 4 }} />
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Accepted Users
      </Typography>
      <Grid container spacing={3}>
        
        {acceptedUsers.length > 0 ? (
          acceptedUsers.map((user) => (
            <Grid item xs={12} md={4} key={user._id}>
              <Card sx={{ padding: 2, textAlign: "center" }}>
                
                <Avatar
                  alt={user.name}
                  src={user.avatar}
                  sx={{ width: 56, height: 56, marginBottom: 2, marginX: "auto" }}
                />
                <CardContent>
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography color="text.secondary">{user.title}</Typography>
                  <Button
                       component={Link}
                       to={`/chat?receiverId=${user._id}`} // ✅ Pass receiver ID in URL
                       variant="contained"
                       color="success"
                       size="small"
                       sx={{ marginTop: 1 }}
                  >
                    Let's Chat
                  </Button>

                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ marginY: 2 }}>
            No accepted friends yet.
          </Typography>
        )}
      </Grid>
    </Box>
  );
}

export default Dashboard;

