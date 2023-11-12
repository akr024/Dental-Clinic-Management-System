import { useState, useCallback } from 'react'

import GoogleMapMarkers from './GoogleMapMarkers.jsx'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

const mapOptions = {
    clickableIcons: false,
    disableDefaultUI: true
}

const center = {
    lat: 57.70838038819724,
    lng: 11.974257779527578
};

function GoogleMapComponent(props) {
    const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY })

    const [map, setMap] = useState(null)

    const onLoad = useCallback((map) => setMap(map), [])
    const onUnmount = useCallback(() => setMap(null), [])

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={{ height: '100vh' }}
            options={mapOptions}
            center={center}
            zoom={12}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <GoogleMapMarkers map={map} markers={props.mockData} />
        </GoogleMap>
    ) : <div style={{ height: '100vh' }}></div>
}

export default GoogleMapComponent
