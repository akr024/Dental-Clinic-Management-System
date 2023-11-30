var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var patientSchema = new Schema(
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
        }
    });

exports.Patient = mongoose.model('patient', patientSchema);