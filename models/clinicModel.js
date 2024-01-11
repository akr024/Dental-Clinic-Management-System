const mongoose = require('mongoose');

const clinicSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  position: {
    lat: { type: Number },
    lng: { type: Number },
  },
  address: { type: String, required: true },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'appointment' }],
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: 'review' }]

});

exports.Clinic = mongoose.model('clinic', clinicSchema);