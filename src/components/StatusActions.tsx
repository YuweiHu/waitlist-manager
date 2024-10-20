import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
} from "@mui/material";
import { Status } from "@/lib/type";

interface StatusActionsProps {
  status: Status;
  positionInQueue: number;
  loading: boolean;
  leaveWaitlist: () => void;
  checkIn: () => void;
  setPartyId: React.Dispatch<React.SetStateAction<string | null>>;
}

const StatusActions: React.FC<StatusActionsProps> = ({
  status,
  positionInQueue,
  loading,
  leaveWaitlist,
  checkIn,
  setPartyId,
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (positionInQueue === 1) {
      setOpen(true);
    }
  }, [positionInQueue]);

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      {status === Status.Waiting && (
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
          <Dialog open={open} fullWidth>
            <DialogTitle>Notification</DialogTitle>
            <DialogContent>Good news! You are the next one!</DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Confirm</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      {status === Status.Serving && (
        <Typography variant="body1">You are currently being served.</Typography>
      )}
      {status === Status.Ready && (
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
      {status === Status.Completed && (
        <Button
          variant="contained"
          color="success"
          fullWidth
          size="large"
          onClick={() => setPartyId(null)}
          disabled={loading}
        >
          {"Back to Waiting List"}
        </Button>
      )}
    </Stack>
  );
};

export default StatusActions;
