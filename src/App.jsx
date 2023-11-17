import { useMemo, useState } from 'react'
import './App.css'

import { CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import GoogleMapComponent from './components/map/GoogleMapComponent.jsx'
import NavBar from './components/navbar/NavBar.jsx'
import SideBar from './components/SideBar.jsx'
import SignInSignUpModal from './components/signin/SignInSignUpModal'

function generateMockData() {
  const numPins = Math.round(Math.random() * 20 + 1)
  return Array.from({ length: numPins }, (_, i) => {
    return {
      title: `Clinic ${i}`,
      position: {
        lat: 57.70838038819724 + (Math.random() * 0.1 - 0.05),
        lng: 11.974257779527578 + (Math.random() * 0.1 - 0.05)
      }
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
    <div id="rootContainer">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar toggleColorMode={() => setColorMode(theme.palette.mode === 'dark' ? 'light' : 'dark')} onLoginClick={() => setSignInModalOpen(true)} />
        <div id="contentContainer">
          <GoogleMapComponent mockData={mockData} />
          <SideBar onSearchClick={() => { setMockData(generateMockData()) }} />
        </div>
        <SignInSignUpModal open={signInModalOpen} onClose={() => setSignInModalOpen(false)} />
      </ThemeProvider>
    </div>
  )
}

export default App
