"use client";

import { useState, useEffect } from "react";
import { Container, Typography, Alert, Stack } from "@mui/material";
import { Status } from "@/lib/type";
import WaitlistForm from "@/components/WaitListForm";
import StatusActions from "@/components/StatusActions";

export default function HomePage() {
  const [partyId, setPartyId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);
  const [positionInQueue, setPositionInQueue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (partyId && ![Status.Completed, Status.Ready].includes(status!)) {
      const interval = setInterval(() => {
        fetch(`/api/waitlist/status?partyId=${partyId}`)
          .then((res) => res.json())
          .then((data) => {
            setStatus(data.status);
            setPositionInQueue(data.positionInQueue);
          })
          .catch((err) => console.error(err));
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [partyId, status]);

  const joinWaitlist = async (name: string, partySize: number) => {
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
        setStatus(Status.Waiting);
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
        setStatus(null);
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
        setStatus(Status.Serving);
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
      <WaitlistForm onJoin={joinWaitlist} loading={loading} error={error} />
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome!
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Typography variant="h6">
          Status: <strong>{status && status.toUpperCase()}</strong>
        </Typography>
        <StatusActions
          status={status!}
          positionInQueue={positionInQueue}
          loading={loading}
          leaveWaitlist={leaveWaitlist}
          checkIn={checkIn}
          setPartyId={setPartyId}
        />
      </Stack>
    </Container>
  );
}
