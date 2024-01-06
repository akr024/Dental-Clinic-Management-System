import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  TextField,
} from "@mui/material";
import { useState } from "react";


function ReviewModal({ open, onClose }) {
  const [ratingValue, setRatingValue] = useState(0);
  return (
    <Dialog open={open} onClose={onClose} >
      <DialogTitle>Review</DialogTitle>

      <DialogContent>
        <Box sx={{display: 'flex'}}>
          <Rating
            value={ratingValue}
            onChange={(event, newValue) => setRatingValue(newValue)}
            sx={{ mb: 1 }}
          />
        </Box>
        <TextField label="Review" multiline minRows={4} maxRows={4}></TextField>
      </DialogContent>
      <DialogActions>
        <Button> Submit </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReviewModal;
