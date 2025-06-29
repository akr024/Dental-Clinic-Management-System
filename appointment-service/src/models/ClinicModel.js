import { Schema, model } from "mongoose";

const clinicSchema = Schema({
  name: { type: String, required: true, unique: true },
  position: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  address: { type: String, required: true },
  appointments: [{ type: Schema.Types.ObjectId, ref: 'appointment' }],
  review: [{ type: Schema.Types.ObjectId, ref: 'review' }]

});

export const Clinic = model('clinic', clinicSchema);
