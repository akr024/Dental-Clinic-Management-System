import { Api, isAuthenticated, getAuthenticatedUserId } from '../Api.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Typography, Paper, TextField, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';


export default function Personal() {

  const [name, setName] = useState('')
  const [personnummer, setPersonnummer] = useState('')
  const [email, setEmail] = useState('')
  const [appointments, setAppointments] = useState([])
  const [editInlineOpen, setEditInlineOpen] = useState(false)

  // New state variables for edited values
  const [editedName, setEditedName] = useState('');
  const [editedPersonnummer, setEditedPersonnummer] = useState('');
  const [editedEmail, setEditedEmail] = useState('');

  const getInfo = () => {
    if (isAuthenticated()) {
      Api.get(`/patients/${getAuthenticatedUserId()}`).then((res) => {
        setName(res.data.name);
        setEmail(res.data.email);
        setPersonnummer(res.data.personnummer);
        setAppointments(res.data.appointments);
      })
  }
  }

  useEffect(() => {
    getInfo();
  }, []); // Empty dependency array to ensure useEffect runs only once on mount

  const handleSave = () => {
    // Add logic to save the updated values to the server if needed
    // For now, let's just toggle the edit mode
    if (editedName.trim() === '' || editedPersonnummer.trim() === '' || editedEmail.trim() === '') {
      console.error('Please fill in all fields.');
      return;
    }

    setName(editedName);
    setPersonnummer(editedPersonnummer);
    setEmail(editedEmail);
    setEditInlineOpen((previous) => !previous);

    Api.put(`/patients/${getAuthenticatedUserId()}`, {
      name: editedName,
      personnummer: editedPersonnummer,
      email: editedEmail,
    }).then(() => {
      setName(editedName);
      setPersonnummer(editedPersonnummer);
      setEmail(editedEmail);
      setEditInlineOpen(false);
    }).catch((error) => {
      console.error('Error saving changes:', error);
    });
  };

  // Function to check if an appointment's date is in the future
  const isFutureAppointment = (appointment) => {
    const appointmentDate = new Date(appointment.date);
    const currentDate = new Date();
    return appointmentDate > currentDate;
  };


  return (
    <Box>
      <Typography variant='h2' align='center'>Personal Page</Typography>
      <Box sx={{border: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '15vh'}}>
        <Typography variant='h4' align='center' sx={{ marginBottom: '15px'}}>User Info</Typography>
        <Typography variant='h5' align='left' sx={{ marginBottom: '15px' }}>Name: {name}</Typography>
        {editInlineOpen && <TextField value={editedName} onChange={(e) => setEditedName(e.target.value)} label="New Name" sx={{ marginBottom: '16px' }}/>}
        <Typography variant='h5' align='left' sx={{ marginBottom: '15px' }}>Personnummer: {personnummer}</Typography>
        {editInlineOpen && <TextField value={editedPersonnummer} onChange={(e) => setEditedPersonnummer(e.target.value)} label="New Personnummer" sx={{ marginBottom: '16px' }}/>}
        <Typography variant='h5' align='left' sx={{ marginBottom: '15px' }}>Email: {email}</Typography>
        {editInlineOpen && <TextField value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} label="New Email" sx={{ marginBottom: '16px' }}/>}
      </Box>
      <Box sx={{ marginTop: '10px', marginBottom: '10px', textAlign: 'center' }}>
        {editInlineOpen ? (
          <Button variant="contained" size='medium' onClick={handleSave}>
            Save
          </Button>
        ) : (
          <Button variant="contained" size='medium' startIcon={<EditIcon/>} onClick={() => setEditInlineOpen(true)}>
            Edit
          </Button>
        )}
      </Box>
      
      <Box sx={{ border: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '15vh', marginTop: '15px' }}>
        <Typography variant='h4' align='center' sx={{ marginBottom: '15px' }}>
          Future Appointments
        </Typography>
        {appointments
          .filter((appointment) => isFutureAppointment(appointment))
          .map((futureAppointment, index) => (
            <Typography key={index} variant='h5' align='left' sx={{ marginBottom: '8px' }}>
              {futureAppointment.date}: {futureAppointment.description}
            </Typography>
          ))}
      </Box>
    
      <Box sx={{ border: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '15vh', marginTop: '15px' }}>
        <Typography variant='h4' align='center' sx={{ marginBottom: '15px' }}>
          Past Appointments
        </Typography>
        {appointments
          .filter((appointment) => !isFutureAppointment(appointment))
          .map((pastAppointment, index) => (
            <Typography key={index} variant='h5' align='left' sx={{ marginBottom: '8px' }}>
              {pastAppointment.date}: {pastAppointment.description}
            </Typography>
          ))}
      </Box>
    </Box>
  )
}
