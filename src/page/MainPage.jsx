import { Box } from "@mui/material"
import GoogleMapComponent from "../components/map/GoogleMapComponent"
import ClinicDetailsComponent from "../components/ClinicDetailsComponent"
import SearchComponent from "../components/SearchComponent"
import { Api, isAuthenticated } from "../Api"
import { useState } from "react"
import { useOutletContext } from "react-router-dom"

function MainPage({ }) {
  const [setSignInModalOpen] = useOutletContext()

  const [clinicData, setClinicData] = useState([])
  const [selectedClinic, setSelectedClinic] = useState(null)

  const onSearchClick = (from, to) => {
    setSelectedClinic(null)

    Api.get('/clinics', { params: { onlyAvailable: true, from, to } })
      .then(response => setClinicData(response.data))
      .catch(err => console.log(err))
  }

  // Simplest way to get it to be responsive when clicking on the same card twice
  const onClinicSelect = e => setSelectedClinic(e ? { ...e } : null)

  return (
    <>
      <Box sx={{ display: 'flex', height: { xs: 'inherit', md: '100%' }, flexDirection: { xs: 'column', md: 'row' }, overflow: 'hidden', position: 'relative' }}>
        <GoogleMapComponent clinicData={clinicData} selectedClinic={selectedClinic} onMarkerClick={onClinicSelect}>
          <ClinicDetailsComponent selectedClinic={selectedClinic} setSignInModalOpen={setSignInModalOpen} />
        </GoogleMapComponent>
        <SearchComponent onSearchClick={onSearchClick} clinicData={clinicData} onCardClick={onClinicSelect} />
      </Box>
    </>
  )
}

export default MainPage
