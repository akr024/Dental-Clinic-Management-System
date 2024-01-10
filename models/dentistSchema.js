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
        clinics: [{ type: mongoose.Schema.Types.ObjectId, ref: 'clinic' }]
    });
dentistSchema.methods.isValidPassword = function (password) {
    const patient = this;
    const isValid = password === patient.password;
    
    return isValid;
};
const DentistModel = mongoose.model('Dentist', dentistSchema);
module.exports = DentistModel;