import {mongoose } from "mongoose";

var patientSchema = new mongoose.Schema(
    {
        Personnummer: {
            type: String,
            required: true,
            unique: true
        },
        Firstname: {
            type: String,
            required: true
        },
        Lastname: {
            type: String,
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
        appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'appointment' }]
        
    });

var Patient = mongoose.model('Patient', patientSchema);
export { Patient };
