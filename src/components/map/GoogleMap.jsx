import { GoogleMapsProvider } from '@ubilabs/google-maps-react-hooks'
import { useState } from 'react'

import GoogleMapMarkers from './GoogleMapMarkers.jsx'

const mapOptions = {
    zoom: 12,
    center: {
        lat: 57.70838038819724,
        lng: 11.974257779527578
    },
    clickableIcons: false,
    disableDefaultUI: true
}

function GoogleMap(props) {
    const [mapContainer, setMapContainer] = useState(null)

    return (
        <>
            <GoogleMapsProvider
                googleMapsAPIKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                mapOptions={mapOptions}
                mapContainer={mapContainer}
            >
                <div ref={node => setMapContainer(node)} style={{ height: '100vh' }} />
                <GoogleMapMarkers markers={props.mockData} />
            </GoogleMapsProvider>
        </>
    )
}

export default GoogleMap
