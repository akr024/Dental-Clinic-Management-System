const mongoose = require('mongoose');

const clinicSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  position: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  address: { type: String, required: true }

});

exports.Clinic = mongoose.model('clinic', clinicSchema);