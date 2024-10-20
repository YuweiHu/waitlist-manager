import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { TOTAL_SEATS } from "@/lib/constant";

interface WaitlistFormProps {
  onJoin: (name: string, partySize: number) => void;
  loading: boolean;
  error: string;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({
  onJoin,
  loading,
  error,
}) => {
  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onJoin(name, partySize);
  };

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
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
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
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={loading || !name || !partySize}
          sx={{ mt: 3 }}
        >
          {loading ? <CircularProgress size={24} /> : "Join Waitlist"}
        </Button>
      </Box>
    </Container>
  );
};

export default WaitlistForm;
