import { useMemo, useState } from 'react'

import { Box, CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import enGB from 'date-fns/locale/en-GB'

import GoogleMapComponent from './components/map/GoogleMapComponent.jsx'
import NavBar from './components/navbar/NavBar.jsx'
import SearchComponent from './components/SearchComponent.jsx'
import SignInSignUpModal from './components/signin/SignInSignUpModal'
import ClinicDetailsComponent from './components/ClinicDetailsComponent.jsx'
import ConfirmAppointmentDialog from './components/ConfirmAppointmentDialog.jsx'

function generateMockData() {
  const numPins = Math.round(Math.random() * 20 + 1)
  return Array.from({ length: numPins }, (_, i) => {
    return {
      id: i,
      clinicName: `Clinic ${i}`,
      rating: Math.random() * 2 + 2.5,
      address: `Drottningtorget ${Math.round(Math.random() * 20 + 1)}, Gothenburg`,
      position: {
        lat: 57.70838038819724 + (Math.random() * 0.1 - 0.05),
        lng: 11.974257779527578 + (Math.random() * 0.1 - 0.05)
      },
      appointments: generateMockAppointments() // Assuming the backend will return only clinics with available appointments for a given time slot
    }
  })
}

function generateMockAppointments() {
  const numAppointments = Math.round(Math.random() * 20 + 5)
  return Array.from({ length: numAppointments }, (_, i) => {
    return {
      id: i,
      time: new Date(new Date().getTime() + Math.random() * 1000 * 60 * 60 * 240).toISOString(),
      available: Math.random() > 0.1
    }
  }).sort((a, b) => new Date(a.time) - new Date(b.time))
}

function App() {
  const [signInModalOpen, setSignInModalOpen] = useState(false)
  const [confirmAppointmentDialogOpen, setConfirmAppointmentDialogOpen] = useState(false)
  const [mockData, setMockData] = useState(generateMockData())
  const [colorMode, setColorMode] = useState('light')
  const [selectedClinic, setSelectedClinic] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const theme = useMemo(() => createTheme(
    {
      palette: {
        mode: colorMode,
      }
    }
  ), [colorMode]);

  const onSearchClick = () => {
    setSelectedClinic(null)
    setMockData(generateMockData())
  }

  // Simplest way to get it to be responsive when clicking on the same card twice
  const onClinicSelect = e => setSelectedClinic({ ...e })

  const onBookAppointment = selectedAppointment => {
    setSelectedAppointment(selectedAppointment)
    setConfirmAppointmentDialogOpen(true)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <NavBar toggleColorMode={() => setColorMode(theme.palette.mode === 'dark' ? 'light' : 'dark')} onLoginClick={() => setSignInModalOpen(true)} />
          <Box sx={{ display: 'flex', height: { xs: 'inherit', md: '100%' }, flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden', position: 'relative' }}>
            <GoogleMapComponent mockData={mockData} selectedClinic={selectedClinic} onMarkerClick={onClinicSelect}>
              <ClinicDetailsComponent selectedClinic={selectedClinic} onBookAppointment={onBookAppointment} />
            </GoogleMapComponent>
            <SearchComponent onSearchClick={onSearchClick} searchResultMockData={mockData} onCardClick={onClinicSelect} />
          </Box>
          <SignInSignUpModal open={signInModalOpen} onClose={() => setSignInModalOpen(false)} />
          <ConfirmAppointmentDialog open={confirmAppointmentDialogOpen} onClose={() => setConfirmAppointmentDialogOpen(false)} appointment={selectedAppointment}/>
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  )
}

export default App
