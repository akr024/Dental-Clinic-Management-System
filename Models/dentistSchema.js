const { Appointment } = require('./appointmentSchema.js');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
        createdAppointments: [Appointment.schema]
    });

dentistSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const harshedPass = await bcrypt.hash(this.password, salt);
        this.password = harshedPass;
        next;
    } catch (error) {
        next(error);
    }
})
exports.Dentist = mongoose.model('dentist', dentistSchema);