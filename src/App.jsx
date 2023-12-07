import { useMemo, useState } from 'react'

import { Box, CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import enGB from 'date-fns/locale/en-GB'

import { AppointmentConfirmationModal, BookingStates } from './components/AppointmentConfirmationModal.jsx'
import ClinicDetailsComponent from './components/ClinicDetailsComponent.jsx'
import ConfirmAppointmentDialog from './components/ConfirmAppointmentDialog.jsx'
import SearchComponent from './components/SearchComponent.jsx'
import GoogleMapComponent from './components/map/GoogleMapComponent.jsx'
import NavBar from './components/navbar/NavBar.jsx'
import SignInSignUpModal from './components/signin/SignInSignUpModal'

import { Api } from './Api.js'

function App() {
  const [signInModalOpen, setSignInModalOpen] = useState(false)
  const [confirmAppointmentDialogOpen, setConfirmAppointmentDialogOpen] = useState(false)
  const [clinicData, setClinicData] = useState([])
  const [colorMode, setColorMode] = useState('light')
  const [selectedClinic, setSelectedClinic] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [authenticated, setAuthenticated] = useState(false) // temporary, remove when authentication is implemented
  const [appointmentConfirmationDialogOpen, setAppointmentConfirmationDialogOpen] = useState(false)
  const [appointmentState, setAppointmentState] = useState(BookingStates.PENDING)

  const theme = useMemo(() => createTheme({
    palette: {
      mode: colorMode,
    }
  }), [colorMode]);

  const isAuthenticated = () => authenticated

  const onSearchClick = (from, to) => {
    setSelectedClinic(null)

    Api.get('/clinics', { params: { onlyAvailable: true, from, to } })
      .then(response => setClinicData(response.data))
      .catch(err => console.log(err))
  }

  // Simplest way to get it to be responsive when clicking on the same card twice
  const onClinicSelect = e => setSelectedClinic(e ? { ...e } : null)

  const onBookAppointment = selectedAppointment => {
    if (isAuthenticated()) {
      setSelectedAppointment(selectedAppointment)
      setConfirmAppointmentDialogOpen(true)
    } else {
      setSignInModalOpen(true)
    }
  }

  const onConfirmAppointment = confirmed => {
    setConfirmAppointmentDialogOpen(false)

    if (confirmed) {
      setAppointmentConfirmationDialogOpen(true)
      setAppointmentState(BookingStates.PENDING)

      Api.post(`/appointments/${selectedAppointment.id}/book`)
        .then(() => {
          setAppointmentState(BookingStates.CONFIRMED)

          // Remove the appointment from the list. Need to find the reference because selectedClinic is a copy
          const clinic = clinicData.find(e => e._id === selectedClinic._id)
          const appointmentIndex = clinic.appointments.findIndex(e => e._id === selectedAppointment._id)
          clinic.appointments.splice(appointmentIndex, 1);
          setSelectedClinic(clinic)
        })
        .catch(() => setAppointmentState(BookingStates.FAILED))
    }
  }

  const onSignIn = () => {
    setSignInModalOpen(false)
    setAuthenticated(true)
  }

  const onSignoutClick = () => setAuthenticated(false)

  const toggleColorMode = () => setColorMode(theme.palette.mode === 'dark' ? 'light' : 'dark')

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <NavBar authenticated={isAuthenticated()} toggleColorMode={toggleColorMode} onSigninClick={() => setSignInModalOpen(true)} onSignoutClick={onSignoutClick} />
          <Box sx={{ display: 'flex', height: { xs: 'inherit', md: '100%' }, flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden', position: 'relative' }}>
            <GoogleMapComponent clinicData={clinicData} selectedClinic={selectedClinic} onMarkerClick={onClinicSelect}>
              <ClinicDetailsComponent selectedClinic={selectedClinic} onBookAppointment={onBookAppointment} />
            </GoogleMapComponent>
            <SearchComponent onSearchClick={onSearchClick} clinicData={clinicData} onCardClick={onClinicSelect} />
          </Box>
          <SignInSignUpModal open={signInModalOpen} onClose={onSignIn} />
          <ConfirmAppointmentDialog open={confirmAppointmentDialogOpen} onClose={onConfirmAppointment} appointment={selectedAppointment} />
          <AppointmentConfirmationModal
            open={appointmentConfirmationDialogOpen}
            onClose={() => setAppointmentConfirmationDialogOpen(false)}
            clinic={selectedClinic}
            appointment={selectedAppointment}
            appointmentState={appointmentState}
          />
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  )
}

export default App
