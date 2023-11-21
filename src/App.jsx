import { useMemo, useState } from 'react'

import { Box, CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

import GoogleMapComponent from './components/map/GoogleMapComponent.jsx'
import NavBar from './components/navbar/NavBar.jsx'
import SearchComponent from './components/SearchComponent.jsx'
import SignInSignUpModal from './components/signin/SignInSignUpModal'


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
      appointments: [ // Assuming the backend will return only clinics with available appointments for a given time slot
        {
          time: new Date(new Date().getTime() + Math.random() * 1000 * 60 * 60 * 200).toISOString(),
          durationMinutes: 30, // Not sure if we want this, not used as of time of writing
          available: true
        },
        {
          time: new Date(new Date().getTime() + Math.random() * 1000 * 60 * 60 * 200).toISOString(),
          available: true
        },
        {
          time: new Date(new Date().getTime() + Math.random() * 1000 * 60 * 60 * 200).toISOString(),
          available: false
        }
      ]
    }
  })
}

function App() {
  const [signInModalOpen, setSignInModalOpen] = useState(false)
  const [mockData, setMockData] = useState(generateMockData())
  const [colorMode, setColorMode] = useState('light');

  const theme = useMemo(() => createTheme(
    {
      palette: {
        mode: colorMode,
      }
    }
  ), [colorMode]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <ThemeProvider theme={theme}>
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <CssBaseline />
          <NavBar toggleColorMode={() => setColorMode(theme.palette.mode === 'dark' ? 'light' : 'dark')} onLoginClick={() => setSignInModalOpen(true)} />
          <Box sx={{ display: 'flex', height: { xs: 'inherit', md: '100%' }, flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden' }}>
            <GoogleMapComponent mockData={mockData} />
            <SearchComponent onSearchClick={() => { setMockData(generateMockData()) }} searchResultMockData={mockData} />
          </Box>
          <SignInSignUpModal open={signInModalOpen} onClose={() => setSignInModalOpen(false)} />
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  )
}

export default App
