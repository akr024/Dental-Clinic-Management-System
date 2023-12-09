import { Schema, model } from "mongoose";

const reviewSchema = Schema({
    clinicId: { type: Schema.Types.ObjectId, required: true, ref: 'clinic' },
    patientId: { type: Schema.Types.ObjectId, required: false },
    reviewMsg: { type: String, requireed: true },
    dateTime: { type: Date },
    rating: {
        type: Number,
        required: true
    }
});

export const Review = model('review', reviewSchema);
