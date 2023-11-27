import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material"

function ConfirmAppointmentDialog({ open, onClose, appointment }) {
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="alertDialogTitle"
      aria-describedby="alertDialogDescription"
    >
      <DialogTitle id="alertDialogTitle">Book appointment?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alertDialogDescription">
          {`Would you like to book the appointment at `}
          {appointment && new Date(appointment.time).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' })}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button onClick={() => onClose(true)} autoFocus>Confirm</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmAppointmentDialog