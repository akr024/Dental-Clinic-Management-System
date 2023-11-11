import mongoose, { mongo } from "mongoose";

const reviewSchema = mongoose.Schema(
{
    text:{
        type: String,
        required: true
    },
    rating:{
        type: String,
        required: true
    },
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patient'
      },
    clinicID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clinic'
      }
});

export const Review = mongoose.model('review',reviewSchema);