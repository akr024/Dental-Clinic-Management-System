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
            required: true
        },
        to: [{
            type: String,
            required: true
        }]
    }
);


export const Notification = mongoose.model('Notification', notificationSchema);