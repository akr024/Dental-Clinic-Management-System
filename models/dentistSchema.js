const { Appointment } = require('./appointmentSchema.js');
const mongoose = require('mongoose');

const dentistSchema = mongoose.Schema(
    {
        username: { type: String, unique: true, required: true },
        personnummer: {
            type: String,
            required: true,
            unique: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String
        },
        createdAppointments: [Appointment.schema],
        clinics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'clinic' }]
    });

exports.Dentist = mongoose.model('dentist', dentistSchema);