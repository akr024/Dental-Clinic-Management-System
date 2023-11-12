import mongoose from "mongoose";
import { Appointment } from "./appointmentModel.js";

const patientSchema = mongoose.Schema(
{
    Personnummer: {
        type: String,
        required:true,
        unique:true
    },
    Firstname: {
        type: String,
        required:true
    },
    Lastname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    patientAppointments:[Appointment.schema]
});

export const Patient = mongoose.model('patient',patientSchema)