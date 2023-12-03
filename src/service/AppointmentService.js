import { Appointment } from '../models/AppointmentModel.js'
import { Clinic } from '../models/ClinicModel.js'

import { isFuture, subHours } from 'date-fns'

const MIN_HOURS_AHEAD = 1

async function createAppointment(inputAppointment) {
  try {
    if (!inputAppointment?.dateTime || !inputAppointment?.clinicId || !inputAppointment?.dentistId) {
      return { success: false, msg: 'dateTime, clinicId and dentistId required' }
    }

    const dateTime = new Date(inputAppointment.dateTime)

    if (!isFuture(subHours(dateTime, MIN_HOURS_AHEAD))) {
      return { success: false, msg: `appointment must be created at least ${MIN_HOURS_AHEAD} hour in advance` }
    }

    const clinic = await Clinic.findById(inputAppointment.clinicId)

    if (!clinic) {
      return { success: false, msg: `Clinic with id ${inputAppointment.clinicId} doesn't exist` }
    }

    const newAppointment = await new Appointment({
      clinicId: inputAppointment.clinicId,
      dentistId: inputAppointment.dentistId,
      dateTime: dateTime
    });

    const savedAppointment = await newAppointment.save();

    clinic.appointments.push(savedAppointment)
    await clinic.save()

    return { success: true, appointment: savedAppointment }
  } catch (err) {
    console.log(err.stack)
    return { success: false, msg: 'internal server error' }
  }
}


export default {
  createAppointment,
}