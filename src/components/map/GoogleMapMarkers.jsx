
import { useEffect } from 'react'

function GoogleMapMarkers(props) {
  useEffect(() => {
    if (!props.map) {
      return
    }

    const newMarkers = props.markers.map((data, index) => {
      return new google.maps.Marker({
        map: props.map,
        title: data.title,
        position: {
          lat: data.position.lat,
          lng: data.position.lng,
        }
      })
    })

    const latLngBounds = new google.maps.LatLngBounds()
    newMarkers.forEach(marker => latLngBounds.extend(marker.getPosition()))
    props.map.fitBounds(latLngBounds)

    return () => newMarkers.forEach(marker => marker.setMap(null))
  }, [props.map, props.markers])

  return null
}

export default GoogleMapMarkers
