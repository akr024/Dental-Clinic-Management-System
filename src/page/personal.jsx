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
      })
  }

    Api.get(`/patients/${getAuthenticatedUserId()}/appointments`).then((res) => {
      setAppointments(res.data.appointments);
    })
  }

  const handleSave = () => {
    // Add logic to save the updated values to the server if needed
    // For now, let's just toggle the edit mode
    setName(editedName);
    setPersonnummer(editedPersonnummer);
    setEmail(editedEmail);
    setEditInlineOpen((previous) => !previous);
  };


  return (
    <Box>
      <Typography variant='h2' align='center'>Personal Page</Typography>
      <Box sx={{border: 1}}>
        <Typography variant='h5' align='left'>Name: {name}</Typography>
        {editInlineOpen && <TextField value={editedName} onChange={(e) => setEditedName(e.target.value)} label="Name"/>}
        <Typography variant='h5' align='left'>Personnummer: {personnummer}</Typography>
        {editInlineOpen && <TextField value={editedPersonnummer} onChange={(e) => setEditedPersonnummer(e.target.value)} label="Personnummer"/>}
        <Typography variant='h5' align='left'>Email: {email}</Typography>
        {editInlineOpen && <TextField value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} label="Email"/>}
      </Box>
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
  )
}


/*
export default function Personal() {
  const [name, setName] = useState('hello');
  const [personnummer, setPersonnummer] = useState('');
  const [email, setEmail] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [editInlineOpen, setEditInlineOpen] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPersonnummer, setEditedPersonnummer] = useState('');
  const [editedEmail, setEditedEmail] = useState('');

  const getInfo = () => {
    if (isAuthenticated()) {
      Api.get(`/patients/${getAuthenticatedUserId()}`).then((res) => {
        setName(res.data.name);
        setEmail(res.data.email);
        setPersonnummer(res.data.personnummer);
      });

      Api.get(`/patients/${getAuthenticatedUserId()}/appointments`).then((res) => {
        setAppointments(res.data.appointments);
      });
    }
  };

  useEffect(() => {
    getInfo();
  }, []); // Empty dependency array to ensure useEffect runs only once on mount

  const handleSave = () => {
    if (editedName.trim() === '' || editedPersonnummer.trim() === '' || editedEmail.trim() === '') {
      console.error('Please fill in all fields.');
      return;
    }

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

  return (
    <Box>
      <Typography variant='h2' align='center'>Personal Page</Typography>
      <Box sx={{border: 1}}>
        <Typography variant='h5' align='left'>Name: {name}</Typography>
        {editInlineOpen && <TextField value={editedName} onChange={(e) => setEditedName(e.target.value)} label="Name"/>}
        <Typography variant='h5' align='left'>Personnummer: {personnummer}</Typography>
        {editInlineOpen && <TextField value={editedPersonnummer} onChange={(e) => setEditedPersonnummer(e.target.value)} label="Personnummer"/>}
        <Typography variant='h5' align='left'>Email: {email}</Typography>
        {editInlineOpen && <TextField value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} label="Email"/>}
      </Box>
      <Button variant="contained" size='medium' onClick={editInlineOpen ? handleSave : () => setEditInlineOpen(true)}>
        {editInlineOpen ? 'Save' : 'Edit'}
        {!editInlineOpen && <EditIcon style={{ marginLeft: '8px' }} />}
      </Button>
    </Box>
  );
}

*/