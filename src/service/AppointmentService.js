import { Appointment } from '../models/AppointmentModel.js'
import { Clinic } from '../models/ClinicModel.js'

import { isFuture, subHours } from 'date-fns'

import mongoose from 'mongoose'

const MIN_HOURS_BEFORE_APPOINTMENT_CREATION = 2
const MIN_HOURS_BEFORE_BOOKING = 1

async function createAppointment(inputAppointment) {
  try {
    if (!inputAppointment?.dateTime || !inputAppointment?.clinicId || !inputAppointment?.dentistId) {
      return { success: false, msg: 'dateTime, clinicId and dentistId required' }
    }

    const dateTime = new Date(inputAppointment.dateTime)

    if (!isFuture(subHours(dateTime, MIN_HOURS_BEFORE_APPOINTMENT_CREATION))) {
      return { success: false, msg: `appointment must be created at least ${MIN_HOURS_BEFORE_APPOINTMENT_CREATION} hour in advance` }
    }

    const clinic = await Clinic.findById(inputAppointment.clinicId)

    if (!clinic) {
      return { success: false, msg: `Clinic with id ${inputAppointment.clinicId} doesn't exist` }
    }

    const newAppointment = await new Appointment({
      clinicId: inputAppointment.clinicId,
      dentistId: inputAppointment.dentistId,
      dateTime: dateTime
    })

    const savedAppointment = await newAppointment.save();

    clinic.appointments.push(savedAppointment)
    await clinic.save()

    return { success: true, appointment: savedAppointment }
  } catch (err) {
    console.log(err.stack)
    return { success: false, msg: 'internal server error' }
  }
}

async function bookAppointment(input) {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const appointment = await Appointment.findById(input.appointmentId)

    if (!appointment || !isAppointmentAvailable(appointment)) {
      return { result: false, msg: 'appointment no longer available' }
    }

    appointment.patientId = input.patientId

    await appointment.save()
    await session.commitTransaction()

    return { success: true }
  } catch (err) {
    console.log(err.stack)
    await session.abortTransaction()
    return { success: false, msg: 'internal server error' }
  } finally {
    session.endSession()
  }
}

function isAppointmentAvailable(appointment) {
  return appointment.patientId == null && isFuture(subHours(appointment.dateTime, MIN_HOURS_BEFORE_BOOKING))
}

export default {
  createAppointment,
  bookAppointment,
  MIN_HOURS_BEFORE_BOOKING
}