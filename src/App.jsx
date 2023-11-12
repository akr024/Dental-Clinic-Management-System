import { useState } from 'react'
import './App.css'

import { CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'

import GoogleMapComponent from './components/map/GoogleMapComponent.jsx'
import SideBar from './components/SideBar.jsx'

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

// Can easily add a switch later
const theme = createTheme({
  palette: {
    mode: 'light',
  }
})

function App() {
  const [mockData, setMockData] = useState(generateMockData())

  return (
    <div id="mainContainer">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GoogleMapComponent mockData={mockData} />
        <SideBar onSearchClick={() => { setMockData(generateMockData()) }} />
      </ThemeProvider>
    </div>
  )
}

export default App
