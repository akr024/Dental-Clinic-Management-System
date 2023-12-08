import { addHours } from 'date-fns'
import { Appointment } from '../models/AppointmentModel.js'
import { Clinic } from '../models/ClinicModel.js'
import GoogleGeocodeService from './GoogleGeocodeService.js'
import { max } from 'date-fns';

import AppointmentService from './AppointmentService.js'

async function createClinic(inputClinic) {
  if (!inputClinic?.name || !inputClinic?.address) {
    return { success: false, msg: 'Clinic name and address required' }
  }

  const addressValidationResult = await GoogleGeocodeService.validateAddress(inputClinic.address)

  let clinicData
  if (addressValidationResult.success) {
    clinicData = {
      name: inputClinic.name,
      address: addressValidationResult.formattedAddress,
      position: addressValidationResult.position
    }
  } else if (inputClinic.position?.lat && inputClinic.position?.lng) {
    clinicData = inputClinic
  } else {
    return { success: false, msg: 'Could not validate address. You can provide coordinates with position.lat and position.lng' }
  }

  try {
    const newClinic = new Clinic(clinicData)

    const savedClinic = await newClinic.save()

    return { success: true, clinic: savedClinic }
  } catch (err) {
    if (err.code === 11000) {
      return { success: false, msg: `A clinic named "${inputClinic.name}" already exists` }
    }

    console.log(err.stack)

    return { success: false, msg: 'internal server error' }
  }
}

async function queryClinics(query) {
  if (!query.appointments) {
    return Clinic.find()
      .select('_id name address position')
      .populate({
        path: 'appointments',
        options: { sort: { date: 1 } }
      })
      .then(result => ({ success: true, clinics: result }))
  }

  const latestAvailabilityDate = addHours(new Date(), AppointmentService.MIN_HOURS_BEFORE_BOOKING)

  const matchStage = { $match: {} }

  if (query.appointments) {
    if (query.appointments.onlyAvailable) {
      matchStage.$match.patientId = null
    }

    if (query.appointments.from || query.appointments.to || query.appointments.onlyAvailable) {
      const dateTimeCondition = {};

      if (query.appointments.onlyAvailable) {
        dateTimeCondition.$gte = latestAvailabilityDate
      }

      if (query.appointments.from) {
        const fromDate = new Date(query.appointments.from)
        dateTimeCondition.$gte = dateTimeCondition.$gte ? max([dateTimeCondition.$gte, fromDate]) : fromDate
      }

      if (query.appointments.to) {
        dateTimeCondition.$lte = new Date(query.appointments.to);
      }

      matchStage.$match.dateTime = dateTimeCondition;
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
            { $ifNull: ['$patientId', true] },
            {
              $gte: ['$dateTime', latestAvailabilityDate]
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
          $sortArray: {
            input: '$appointments', sortBy: { dateTime: 1 }
          }
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
