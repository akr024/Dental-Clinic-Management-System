import {
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { Api } from '../Api';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function ReviewModal({ open, onClose, selectedClinicId }) {
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);
 

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessAlert(false);
  }
    const handleSubmission = async () => {
      try {
        const response = await Api.post(
          '/reviews',
          {
            clinicId: selectedClinicId,
            reviewMsg: reviewText,
            rating: ratingValue,
            dateTime: new Date().toISOString(),
          }
        );
      
        const data = await response.data;
        if (data.success) {
          setSuccessAlert(true);
          onClose(data.review);
        }
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    };

    return (
      <>
        <Dialog open={open} onClose={onClose} >
          <DialogTitle>Review</DialogTitle>

          <DialogContent>
            <Box sx={{ display: "flex" }}>
              <Rating
                value={ratingValue}
                onChange={(event, newValue) => setRatingValue(newValue)}
                sx={{ mb: 1 }}
              />
            </Box>
            <TextField label="Review" multiline minRows={4} maxRows={4} value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}></TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={(handleSubmission)}> Submit </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={successAlert}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            severity="success"
          >
            You have successfully submitted a review!
          </MuiAlert>
        </Snackbar>
      </>
    );
  }
export default ReviewModal;
