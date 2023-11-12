import { useGoogleMap } from '@ubilabs/google-maps-react-hooks'
import { useEffect } from 'react'

function GoogleMapMarkers(props) {
    const map = useGoogleMap()

    useEffect(() => {
        if (!map) {
            return
        }

        const newMarkers = props.markers.map((data, index) => {
            return new google.maps.Marker({
                map,
                title: data.title,
                position: {
                    lat: data.position.lat,
                    lng: data.position.lng,
                }
            })
        })

        const latLngBounds = new google.maps.LatLngBounds()
        newMarkers.forEach(marker => latLngBounds.extend(marker.getPosition()))
        map.fitBounds(latLngBounds)

        return () => newMarkers.forEach(marker => marker.setMap(null))
    }, [map, props.markers])

    return null
}

export default GoogleMapMarkers
