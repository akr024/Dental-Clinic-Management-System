import { useEffect, useRef } from 'react'

const FOCUS_ZOOM = 16

function GoogleMapMarkers({ map, markers, selectedClinic, onMarkerClick }) {
  const markersRef = useRef()

  useEffect(() => {
    if (selectedClinic && markersRef.current) {
      map.setZoom(FOCUS_ZOOM)
      map.setCenter(selectedClinic.position)
    }
  }, [selectedClinic])

  useEffect(() => {
    if (!map || markers?.length === 0) {
      return
    }

    const newMarkers = markers.map(data => {
      const marker = new google.maps.Marker({
        map: map,
        title: data.clinicName,
        position: {
          lat: data.position.lat,
          lng: data.position.lng,
        }
      })

      marker.addListener('click', () => onMarkerClick(data))
      return marker
    })

    markersRef.current = newMarkers

    if (!selectedClinic) {
      const latLngBounds = new google.maps.LatLngBounds()
      newMarkers.forEach(marker => latLngBounds.extend(marker.getPosition()))
      map.fitBounds(latLngBounds)

      if (map.getZoom() > FOCUS_ZOOM) {
        map.setZoom(FOCUS_ZOOM)
      }
    }

    return () => newMarkers.forEach(marker => marker.setMap(null))
  }, [map, markers])

  return null
}

export default GoogleMapMarkers
