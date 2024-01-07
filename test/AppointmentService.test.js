import { addHours } from 'date-fns'
import AppointmentService from '../src/service/AppointmentService.js'

import { Appointment } from '../src/models/AppointmentModel.js'
import { Clinic } from '../src/models/ClinicModel.js'

import mockingoose from 'mockingoose'

describe('AppointmentService', () => {

  describe('cancelAppointment', () => {
    it('should return an error message if required fields are missing', async () => {
      const input = {}
      const expected = { success: false, msg: 'appointmentId and patientId required' }

      const result = await AppointmentService.cancelAppointment(input)

      expect(result).toEqual(expected)
    })

    it('should return an error message if appointment does not exist', async () => {
      const input = { appointmentId: '60d7e3e0a3b4e4a2c8a7e3d1', patientId: '60d7e3e0a3b4e4a2c8a7e3d2' }
      const expected = { success: false, msg: `Appointment with id ${input.appointmentId} doesn't exist` }

      mockingoose(Appointment).toReturn(null, 'findOne')

      const result = await AppointmentService.cancelAppointment(input)

      expect(result).toEqual(expected)
    })

    it('should return an error message if appointment is in the past', async () => {
      const input = { appointmentId: '60d7e3e0a3b4e4a2c8a7e3d1', patientId: '60d7e3e0a3b4e4a2c8a7e3d2' }
      const expected = { success: false, msg: `appointment must be cancelled at least 1 hour in advance` }

      const appointment = { _id: input.appointmentId, tientId: input.patientId, dateTime: addHours(new Date(), -2) }

      mockingoose(Appointment).toReturn(appointment, 'findOne')

      const result = await AppointmentService.cancelAppointment(input)

      expect(result).toEqual(expected)
    })

    it('should return an error message if appointment time is too close', async () => {
      const input = { appointmentId: '60d7e3e0a3b4e4a2c8a7e3d1', patientId: '60d7e3e0a3b4e4a2c8a7e3d2' }
      const expected = { success: false, msg: `appointment must be cancelled at least 1 hour in advance` }

      const appointment = { _id: input.appointmentId, patientId: input.patientId, dateTime: new Date() }

      mockingoose(Appointment).toReturn(appointment, 'findOne')

      const result = await AppointmentService.cancelAppointment(input)

      expect(result).toEqual(expected)
    })

    it('should return an error message if appointment is not booked by the patient', async () => {
      const input = { appointmentId: '60d7e3e0a3b4e4a2c8a7e3d1', patientId: '60d7e3e0a3b4e4a2c8a7e3d2' }
      const expected = { success: false, msg: `Appointment with id ${input.appointmentId} is not booked by patient with id ${input.patientId}` }

      const appointment = { _id: input.appointmentId, dateTime: addHours(new Date(), 5), patientId: '60d7e3e0a3b4e4a2c8a7e3d3' }

      mockingoose(Appointment).toReturn(appointment, 'findOne')

      const result = await AppointmentService.cancelAppointment(input)

      expect(result).toEqual(expected)
    })
  })

  describe('createAppointment', () => {
    it('should return an error message if required fields are missing', async () => {
      const inputAppointment = {}
      const expected = { success: false, msg: 'dateTime, clinicId and dentistId required' }

      const result = await AppointmentService.createAppointment(inputAppointment)

      expect(result).toEqual(expected)
    })

    it('should return an error message if appointment is not created in advance', async () => {
      const inputAppointment = {
        dateTime: new Date(),
        clinicId: 'clinicId',
        dentistId: 'dentistId',
      }
      const expected = { success: false, msg: 'appointment must be created at least 2 hour in advance' }

      const result = await AppointmentService.createAppointment(inputAppointment)

      expect(result).toEqual(expected)
    })

    it('should return an error message if clinic does not exist', async () => {
      const inputAppointment = {
        dateTime: addHours(new Date(), 3),
        clinicId: '60d7e3e0a3b4e4a2c8a7e3d1',
        dentistId: 'dentistId',
      }
      const expected = { success: false, msg: `Clinic with id 60d7e3e0a3b4e4a2c8a7e3d1 doesn't exist` }

      mockingoose(Clinic).toReturn(null, 'findOne')

      const result = await AppointmentService.createAppointment(inputAppointment)

      expect(result).toEqual(expected)
    })

    it('should create a new appointment and update the clinic', async () => {
      const inputAppointment = {
        dateTime: addHours(new Date(), 3),
        clinicId: '60d7e3e0a3b4e4a2c8a7e3d1',
        dentistId: '60d7e3e0a3b4e4a2c8a7e3d2',
      }

      const expectedAppointment = { _id: '60d7e3e0a3b4e4a2c8a7e3d3', ...inputAppointment }
      const clinic = { appointments: [], address: 'abc', _id: inputAppointment.clinicId, name: 'clinicName', position: { lat: 1, lng: 2 } }

      mockingoose(Clinic).toReturn(clinic, 'findOne')
      mockingoose(Appointment).toReturn(expectedAppointment, 'save')

      const result = await AppointmentService.createAppointment(inputAppointment)

      expect(result.success).toBe(true)
      expect(result.appointment._id.toString()).toEqual(expectedAppointment._id.toString())
      expect(result.appointment.dateTime).toEqual(inputAppointment.dateTime)
      expect(result.appointment.clinicId.toString()).toEqual(inputAppointment.clinicId.toString())
      expect(result.appointment.dentistId.toString()).toEqual(inputAppointment.dentistId.toString())
    })
  })
})