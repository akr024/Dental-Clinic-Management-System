const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
    {
        dateTime: {
            type: Date,
            required: true
        },
        patientID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'patient'
        },
        dentistID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'dentist'
        }

    }
);

exports.Appointment = mongoose.model('appointment', appointmentSchema);