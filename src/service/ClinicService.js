import { Clinic } from '../models/ClinicModel.js'
import GoogleGeocodeService from './GoogleGeocodeService.js'

async function createClinic(inputClinic) {
  if (!inputClinic?.name || !inputClinic?.address) {
    return { success: false, msg: 'Clinic name and address required' }
  }

  const addressValidationResult = await GoogleGeocodeService.validateAddress(inputClinic.address)

  if (!addressValidationResult.success) {
    return { success: false, msg: addressValidationResult.msg }
  }

  try {
    const clinic = await new Clinic({
      name: inputClinic.name,
      address: addressValidationResult.formattedAddress,
      position: addressValidationResult.position
    }).save()

    return { success: true, clinic }
  } catch (err) {
    if (err.code === 11000) {
      return { success: false, msg: `A clinic named "${inputClinic.name}" already exists` }
    }

    console.log(err.stack)

    return { success: false, msg: 'internal server error' }
  }
}

async function queryClinics() {
  return await Clinic.find()
    .select('_id name address position')
    .then(clinics => ({ clinics }))
}

export default {
  createClinic,
  queryClinics
}