import { useEffect, useMemo, useRef, useState } from 'react'

import { Box, CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import enGB from 'date-fns/locale/en-GB'

import ClinicDetailsComponent from './components/ClinicDetailsComponent.jsx'
import SearchComponent from './components/SearchComponent.jsx'
import GoogleMapComponent from './components/map/GoogleMapComponent.jsx'
import NavBar from './components/navbar/NavBar.jsx'
import SignInSignUpModal from './components/signin/SignInSignUpModal'

import { Api, getSecondsBeforeJwtExpires, isAuthenticated, signOut } from './Api.js'


function App() {
  const [signInModalOpen, setSignInModalOpen] = useState(false)
  const [clinicData, setClinicData] = useState([])
  const [colorMode, setColorMode] = useState('dark')
  const [selectedClinic, setSelectedClinic] = useState(null)
  const [authenticated, setAuthenticated] = useState(isAuthenticated())

  const theme = useMemo(() => createTheme({
    palette: {
      mode: colorMode,
    }
  }), [colorMode]);

  const authTimeoutIdRef = useRef()
  useEffect(() => {
    if (authTimeoutIdRef.current) {
      clearTimeout(authTimeoutIdRef.current)
    }

    if (authenticated) {
      // TODO: maybe show a "session expired" dialog or something later on
      authTimeoutIdRef.current = setTimeout(() => setAuthenticated(false), getSecondsBeforeJwtExpires() * 1000)
    }
  }, [authenticated])

  const onSearchClick = (from, to) => {
    setSelectedClinic(null)

    Api.get('/clinics', { params: { onlyAvailable: true, from, to } })
      .then(response => setClinicData(response.data))
      .catch(err => console.log(err))
  }

  // Simplest way to get it to be responsive when clicking on the same card twice
  const onClinicSelect = e => setSelectedClinic(e ? { ...e } : null)

  const onSignIn = () => {
    setSignInModalOpen(false)
    setAuthenticated(isAuthenticated())
  }

  const onSignoutClick = () => {
    setAuthenticated(false)
    signOut()
  }

  const toggleColorMode = () => setColorMode(theme.palette.mode === 'dark' ? 'light' : 'dark')

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <NavBar authenticated={authenticated} toggleColorMode={toggleColorMode} onSigninClick={() => setSignInModalOpen(true)} onSignoutClick={onSignoutClick} />
          <Box sx={{ display: 'flex', height: { xs: 'inherit', md: '100%' }, flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden', position: 'relative' }}>
            <GoogleMapComponent clinicData={clinicData} selectedClinic={selectedClinic} onMarkerClick={onClinicSelect}>
              <ClinicDetailsComponent selectedClinic={selectedClinic} setSignInModalOpen={setSignInModalOpen} />
            </GoogleMapComponent>
            <SearchComponent onSearchClick={onSearchClick} clinicData={clinicData} onCardClick={onClinicSelect} />
          </Box>
          <SignInSignUpModal open={signInModalOpen} onClose={onSignIn} />
        </Box>
      </ThemeProvider>
    </LocalizationProvider>
  )
}

export default App
