import mongoose from "mongoose";

const clinicSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  position: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  address: { type: String, required: true }
});

export const Clinic = mongoose.model('clinic', clinicSchema);
