const mongoose = require('mongoose');
const patientSchema = new mongoose.Schema(
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
    }
});
patientSchema.methods.isValidPassword = function (password) {
    const patient = this;
  
    // Compare the provided password with the stored password
    const isValid = password === patient.password;
  
    return isValid;
  };
const PatientModel = mongoose.model('Patient', patientSchema);
module.exports = PatientModel;