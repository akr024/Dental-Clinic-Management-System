import { useState, useCallback, useEffect } from 'react'

import GoogleMapMarkers from './GoogleMapMarkers.jsx'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

import { useTheme } from '@mui/material/styles'

import { googleMapDarkModeStyles, googleMapLightModeStyles } from './GoogleMapStyles.js'

const center = {
  lat: 57.70838038819724,
  lng: 11.974257779527578
};

function GoogleMapComponent({ children, clinicData, selectedClinic, onMarkerClick }) {
  const theme = useTheme()

  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY })

  const [map, setMap] = useState(null)

  const onLoad = useCallback((map) => setMap(map), [])
  const onUnmount = useCallback(() => setMap(null), [])

  useEffect(() => { 
    map?.addListener('click', e => onMarkerClick(null)) 
  }, [map])

  const mapOptions = {
    minZoom: 10,
    clickableIcons: false,
    disableDefaultUI: true,
    styles: theme.palette.mode === 'dark' ? googleMapDarkModeStyles : googleMapLightModeStyles
  }

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={{ height: '100%', flex: '1 1 100%', width: { xs: '100vh', md: 'inherit' }, zIndex: 1000 }}
      options={mapOptions}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {children}
      <GoogleMapMarkers map={map} markers={clinicData} selectedClinic={selectedClinic} onMarkerClick={onMarkerClick} />
    </GoogleMap>
  ) : <div style={{ height: '100%' }}></div>
}

export default GoogleMapComponent
