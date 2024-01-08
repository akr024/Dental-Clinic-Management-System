import {mongoose } from "mongoose";

var dentistSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true
        },
        personnummer: {
            type: String,
            required: true,
            unique: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
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
        appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'appointment' }],
        clinics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'clinic' }]
        
    });

var Dentist = mongoose.model('Dentist', dentistSchema);
export { Dentist };
