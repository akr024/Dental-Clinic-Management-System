
import { Button, CircularProgress } from '@mui/material'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'

const style = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxHeight: '100%',
  maxWidth: { md: 400 },
  height: 'inherit',
  width: { xs: '90%', md: 'inherit' },
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflow: 'auto'
}

const BookingStates = {
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
  PENDING: 'pending',
}

function AppointmentConfirmationModal({ open, onClose, appointmentState, clinic, appointment }) {
  if (!clinic || !appointment) {
    return <></>
  }

  const onCloseInternal = () => {
    // Not closeable by the user when booking is pending
    if(appointmentState !== BookingStates.PENDING) {
      onClose()
    }
  }

  const formattedDateTime = new Date(appointment.dateTime).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric' })

  let title, message, color;

  if (appointmentState === BookingStates.CONFIRMED) {
    title = 'Appointment confirmed!';
    message = `Your appointment at ${clinic.name} on ${formattedDateTime} has been confirmed`;
    // Not sure how these work, for some reason I had to specify light here
    color = 'success.light'
  } else if (appointmentState === BookingStates.FAILED) {
    title = 'Could not confirm appointment';
    message = `The appointment at ${clinic.name} on ${formattedDateTime} could not be confirmed. Please try again later.`;
    color = 'error'
  } else {
    title = 'Confirming appointment...';
    message = `Confirming your appointment at ${clinic.name} on ${formattedDateTime}...`;
    color = ''
  }

  return (
    <Modal open={open} onClose={onCloseInternal} sx={{ maxHeight: '100%' }}>
      <Box sx={style} >
        {appointmentState === BookingStates.PENDING && <CircularProgress sx={{ mb: 2 }} />}
        <Typography variant="h6" color={color}>
          {title}
        </Typography>

        <Typography element="p" variant="body1" color="text.secondary" textAlign="center" sx={{ m: 2 }}>
          {message}
        </Typography>

        {appointmentState !== BookingStates.PENDING && <Button onClick={onCloseInternal}>Close</Button>}
      </Box>
    </Modal>
  )
}

export {
  AppointmentConfirmationModal,
  BookingStates
}
