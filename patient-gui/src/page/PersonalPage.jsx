import { Api, isAuthenticated, getAuthenticatedUserId } from '../Api.js'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Typography, Paper, TextField, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { isFuture } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function PersonalPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [personnummer, setPersonnummer] = useState('')
  const [email, setEmail] = useState('')
  const [appointments, setAppointments] = useState([])

  const getInfo = () => {
    Api.get(`/patients/${getAuthenticatedUserId()}`).then((res) => {
      setName(res.data.Firstname + ' ' + res.data.Lastname);
      setEmail(res.data.email);
      setPersonnummer(res.data.Personnummer);
      getAppointments(getAuthenticatedUserId());
    }).catch(err => {
      console.log("Error retrieving user data:", err)
    })
  }

  const getAppointments = (userId) => {
    Api.get(`/patients/${userId}/appointments`).then((res) => {
      setAppointments(res.data.appointments);
      console.log(res.data.appointments);
    }).catch (err => {
      console.log("Error retrieving user's appointments:", err)
    })
  }

  const cancelAppointment = (appointmentId) => {
    Api.post(`/appointments/${appointmentId}/cancel`)
      .then((res) => {
        console.log(res);
        getInfo();
      })
      .catch((error) => {
        console.error('Error canceling appointment:', error);
      });
  };

  useEffect(() => {
    if (isAuthenticated()) {
      getInfo();
    } else {
      navigate('/')
    }
  }, []); // Empty dependency array to ensure useEffect runs only once on mount

  // Function to check if an appointment's date is in the future
  const isFutureAppointment = appointment => isFuture(new Date(appointment.dateTime))

  const futureAppointments = appointments.filter((appointment) => isFutureAppointment(appointment))
  const pastAppointments = appointments.filter((appointment) => !isFutureAppointment(appointment))

  return (
    <Box className="personal-container">
      <Typography variant='h2' align='center'>Personal Page</Typography>
      <Box sx={{border: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '1vh'}}>
        <Typography variant='h4' align='center' sx={{ marginBottom: '15px'}}>User Info</Typography>
        <Typography variant='h5' align='left' sx={{ marginBottom: '15px' }}>Name: {name}</Typography>
        <Typography variant='h5' align='left' sx={{ marginBottom: '15px' }}>Personnummer: {personnummer}</Typography>
        <Typography variant='h5' align='left' sx={{ marginBottom: '15px' }}>Email: {email}</Typography>
      </Box>
      <Box sx={{ border: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '15vh', marginTop: '15px' }}>
        <Typography variant='h4' align='center' sx={{ marginBottom: '15px' }}>
          Future Appointments
        </Typography>
        {futureAppointments.length > 0 ? (
          futureAppointments
            .map((futureAppointment, index) => (
              <Box key={index} sx={{ marginBottom: '8px', display: 'flex', alignItems: 'center'}}>
                <Typography variant='h5' align='left'>
                <span style={{ marginRight: '20px' }}>Appointment: {futureAppointment.dateTime}</span>
                  <Button variant="outlined" size='small' onClick={() => cancelAppointment(futureAppointment._id)}>
                    Cancel
                  </Button>
                </Typography>
                
              </Box>
            ))
        ) : (
          <Typography variant='h5' align='center'>
            No future appointments.
          </Typography>
        )}
        </Box>
    
      <Box sx={{ border: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '15vh', marginTop: '15px' }}>
        <Typography variant='h4' align='center' sx={{ marginBottom: '15px' }}>
          Past Appointments
        </Typography>
        {pastAppointments.length > 0 ? (
          pastAppointments
            .map((pastAppointment, index) => (
              <Box key={index} sx={{ marginBottom: '8px' }}>
                <Typography variant='h5' align='left'>
                  Appointment: {pastAppointment.dateTime}
                </Typography>
              </Box>
            ))
        ) : (
          <Typography variant='h5' align='center'>
            No past appointments.
          </Typography>
        )}
      </Box>
    </Box>
  )
}
