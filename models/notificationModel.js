import mongoose, { mongo } from "mongoose";

const notificationSchema = mongoose.Schema(
{
    type:{
        type: String,
        required: true
    },
    patientID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patient'
      },
    dentistID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'dentist'
    }
});

export const Notification = mongoose.model('notification',notificationSchema);