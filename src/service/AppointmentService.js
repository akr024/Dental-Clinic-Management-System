import { publish } from 'mqtt-service'
import { Appointment } from '../models/AppointmentModel.js'
import { Clinic } from '../models/ClinicModel.js'

import { addHours, isFuture, max, subHours } from 'date-fns'

import mongoose from 'mongoose'

const MIN_HOURS_BEFORE_APPOINTMENT_CREATION = 2
const MIN_HOURS_BEFORE_BOOKING = 1
const MIN_HOURS_BEFORE_CANCELLING = 1

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

async function cancelAppointment(input) {
  try {
    if (!input?.appointmentId || !input?.patientId) {
      return { success: false, msg: 'appointmentId and patientId required' }
    }

    const appointment = await Appointment.findById(input.appointmentId)

    if (!appointment) {
      return { success: false, msg: `Appointment with id ${input.appointmentId} doesn't exist` }
    }

    if (!isFuture(subHours(appointment.dateTime, MIN_HOURS_BEFORE_CANCELLING))) {
      return { success: false, msg: `appointment must be cancelled at least ${MIN_HOURS_BEFORE_CANCELLING} hour in advance` }
    }

    if (appointment.patientId != input.patientId) {
      return { success: false, msg: `Appointment with id ${input.appointmentId} is not booked by patient with id ${input.patientId}` }
    }

    appointment.patientId = null
    appointment.save()

    const data = { 
      appointmentId: input.appointmentId, 
      patientId: input.patientId,
      dentistId: appointment.dentistId,
      dateTime: appointment.dateTime
    }
    publish('appointment/cancelled', JSON.stringify(data))

    return { success: true }
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

async function queryAppointments(input) {
  const latestAvailabilityDate = addHours(new Date(), MIN_HOURS_BEFORE_BOOKING)
  const minDate = max([latestAvailabilityDate, new Date(input.minDate)])

  try {
    const appointments = await Appointment.find({
      clinicId: input.clinicId,
      patientId: null,
      dateTime: { $gte: minDate, $lte: input.maxDate }
    }).sort({ dateTime: 1 })

    return { success: true, appointments }
  } catch (error) {
    console.log(error.stack)
    return { success: false, msg: 'internal server error' }
  }
}

async function queryAppointmentsByDentistID(input) {

  try {
    const dentistID = input.dentistId;
    const appointment = await Appointment.find({
      dentistId : dentistID
    }).select('clinicId patientId dateTime');
    console.log(appointment);
    return { success: true, appointments: appointment };
} catch (error) {
  return { success: false, message: error.message };
}
}

async function queryAppointmentsByPatientID(input) {
  try {
    const patientID = input.patientId;
    const appointment = await Appointment.find({
      patientId : patientID
    }).select('clinicId dentistId dateTime');
    console.log(appointment);
    return { success: true, appointments: appointment };
} catch (error) {
  return { success: false, message: error.message };
}
}

export default {
  createAppointment,
  cancelAppointment,
  bookAppointment,
  queryAppointments,
  queryAppointmentsByDentistID,
  queryAppointmentsByPatientID,
  MIN_HOURS_BEFORE_BOOKING
}