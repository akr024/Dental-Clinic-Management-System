import Axios from 'axios';

const RESULT_OK = "OK"
const RESULT_ZERO_RESULTS = "ZERO_RESULTS"

const API_KEY = process.env.GOOGLE_MAPS_API_KEY

async function validateAddress(address) {
  try {
    const response = await Axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: API_KEY
      }
    })

    const data = response.data
    if (data.status === RESULT_OK) {
      const result = data.results[0]

      return {
        success: true,
        position: result.geometry.location,
        formattedAddress: formatAddress(result.address_components)
      }
    } else if (data.status === RESULT_ZERO_RESULTS) {
      return { success: false, msg: 'invalid address' }
    } else {
      console.log(`Error! Google geocoding api request failed. Response: ${JSON.stringify(data)}`)
    }
  } catch (e) {
    console.log(e.stack)
  }

  return { success: false, msg: 'failed to resolve address' }
}

function formatAddress(addressComponents) {
  const addressComponentsMap = addressComponents.reduce((acc, component) => {
    component.types.forEach(type => {
      acc[type] = acc[type] || []
      acc[type].push(component)
    })
    return acc
  }, {})

  const route = addressComponentsMap['route'][0].long_name
  const streetNumber = addressComponentsMap['street_number'][0].long_name
  const postalTown = addressComponentsMap['postal_town'][0].long_name

  return `${route} ${streetNumber}, ${postalTown}`
}

export default {
  validateAddress
}