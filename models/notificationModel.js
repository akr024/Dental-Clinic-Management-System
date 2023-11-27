import mongoose from 'mongoose';


const notificationSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        time: {
            type: Date,
            required: true
        },
        desc: {
            type: String,
            required: false
        }
    }
);


export const Notification = mongoose.model('Notification', notificationSchema);