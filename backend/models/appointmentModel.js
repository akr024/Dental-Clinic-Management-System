import mongoose, { mongo } from "mongoose";

const appointmentSchema = mongoose.Schema(
{
    dateTime:{
        type:Date,
        required: true
    },
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patient'
      },
    dentistID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentist'
    }
}
);

export const Appointment = mongoose.model('appointment',appointmentSchema);