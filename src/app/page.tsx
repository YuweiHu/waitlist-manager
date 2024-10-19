"use client";

import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { TOTAL_SEATS } from "@/lib/constant";

export default function HomePage() {
  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState<number | null>(null);
  const [partyId, setPartyId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [positionInQueue, setPositionInQueue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (partyId && status !== "completed") {
      const interval = setInterval(() => {
        fetch(`/api/waitlist/status?partyId=${partyId}`)
          .then((res) => res.json())
          .then((data) => {
            setStatus(data.status);
            setPositionInQueue(data.positionInQueue);
          })
          .catch((err) => console.error(err));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [partyId, status]);

  const joinWaitlist = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, partySize }),
      });
      const data = await res.json();
      if (data.success) {
        setPartyId(data.partyId);
        setStatus("waiting");
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while joining the waitlist.");
    } finally {
      setLoading(false);
    }
  };

  const leaveWaitlist = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partyId }),
      });
      const data = await res.json();
      if (data.success) {
        setPartyId(null);
        setStatus("");
        setPositionInQueue(0);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while leaving the waitlist.");
    } finally {
      setLoading(false);
    }
  };

  const checkIn = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/waitlist/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partyId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("You have been seated. Enjoy your meal!");
        setStatus("serving");
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while checking in.");
    } finally {
      setLoading(false);
    }
  };

  if (!partyId) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Join the Waitlist
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Your Name"
            variant="outlined"
            fullWidth
            required
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormControl fullWidth required margin="normal">
            <InputLabel id="party-size-label">Party Size</InputLabel>
            <Select
              labelId="party-size-label"
              id="party-size-select"
              value={partySize}
              label="Party Size"
              onChange={(e) => setPartySize(Number(e.target.value))}
            >
              {[...Array(TOTAL_SEATS)].map((_, index) => (
                <MenuItem key={index + 1} value={index + 1}>
                  {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            onClick={joinWaitlist}
            disabled={loading || !name || !partySize}
            sx={{ mt: 3 }}
          >
            {loading ? <CircularProgress size={24} /> : "Join Waitlist"}
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome, {name}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Typography variant="h6">
          Status: <strong>{status.toUpperCase()}</strong>
        </Typography>
        {status === "waiting" && (
          <>
            <Typography variant="body1">
              Your position in queue: <strong>{positionInQueue}</strong>
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              size="large"
              onClick={leaveWaitlist}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Leave Waitlist"}
            </Button>
          </>
        )}
        {status === "serving" && (
          <Typography variant="body1">
            You are currently being served.
          </Typography>
        )}
        {status === "ready" && (
          <Button
            variant="contained"
            color="success"
            fullWidth
            size="large"
            onClick={checkIn}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Check-in"}
          </Button>
        )}
      </Stack>
    </Container>
  );
}
