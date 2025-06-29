import { Schema, model } from "mongoose";

const appointmentSchema = Schema({
  clinicId: { type: Schema.Types.ObjectId, required: true, ref: 'clinic' },
  dentistId: { type: Schema.Types.ObjectId, required: true, ref: 'dentist' },
  patientId: { type: Schema.Types.ObjectId, required: false },
  dateTime: { type: Date, required: true }
});

appointmentSchema.index({ dateTime: 1 })

export const Appointment = model('appointment', appointmentSchema)
