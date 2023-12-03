import { addHours } from 'date-fns'
import { Appointment } from '../models/AppointmentModel.js'
import { Clinic } from '../models/ClinicModel.js'
import GoogleGeocodeService from './GoogleGeocodeService.js'

const MIN_HOURS_BEFORE_BOOKING = 1

async function createClinic(inputClinic) {
  if (!inputClinic?.name || !inputClinic?.address) {
    return { success: false, msg: 'Clinic name and address required' }
  }

  const addressValidationResult = await GoogleGeocodeService.validateAddress(inputClinic.address)

  if (!addressValidationResult.success) {
    return { success: false, msg: addressValidationResult.msg }
  }

  try {
    const newClinic = new Clinic({
      name: inputClinic.name,
      address: addressValidationResult.formattedAddress,
      position: addressValidationResult.position
    })

    const savedClinic = newClinic.save()

    return { success: true, savedClinic }
  } catch (err) {
    if (err.code === 11000) {
      return { success: false, msg: `A clinic named "${inputClinic.name}" already exists` }
    }

    console.log(err.stack)

    return { success: false, msg: 'internal server error' }
  }
}

async function queryClinics(query) {
  const latestAvailabilityDate = addHours(new Date(), MIN_HOURS_BEFORE_BOOKING)

  const matchStage = { $match: {} }

  if (query.appointments?.onlyAvailable)
    matchStage.$match.patientId = null

  if (query.appointments?.from || query.appointments?.to) {
    matchStage.$match.dateTime = {
      ...(query.appointments.from && { $gte: new Date(query.appointments.from) }),
      ...(query.appointments.to && { $lte: new Date(query.appointments.to) })
    }
  }

  return await Appointment.aggregate([
    matchStage,
    {
      $project: {
        patientId: 1,
        clinicId: 1,
        dateTime: 1,
        available: {
          $and: [
            { $ifNull: ["$patientId", true] },
            {
              $gte: ["$dateTime", latestAvailabilityDate]
            }
          ]
        }
      }
    },
    {
      $group: {
        _id: '$clinicId',
        appointments: { $push: '$$ROOT' }
      }
    },
    {
      $lookup: {
        from: 'clinics',
        localField: '_id',
        foreignField: '_id',
        as: 'clinic'
      }
    },
    {
      $unwind: '$clinic'
    },
    {
      $project: {
        _id: '$clinic._id',
        name: '$clinic.name',
        address: '$clinic.address',
        position: '$clinic.position',
        appointments: {
          _id: 1,
          dateTime: 1,
          available: 1
        }
      }
    }
  ])
    .then(clinics => ({ success: true, clinics }))
}

export default {
  createClinic,
  queryClinics
}
