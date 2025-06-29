const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema(
    {
        availability: {
            type: Boolean,
            required: true
        },
        dateTime: {
            type: Date,
            required: true
        },
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient'
        },
        dentistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'dentist'
        },
        clinicId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'clinic'
        }

    }
);

exports.Appointment = mongoose.model('Appointment', appointmentSchema);