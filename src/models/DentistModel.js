import { Schema,mongoose } from "mongoose";


var dentistSchema = new mongoose.Schema(
    {
        Firstname: {
            type: String,
            required: true
        },
        Lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        appointments: [{ type: Schema.Types.ObjectId, ref: 'appointment' }],
        clinics: [{ type: Schema.Types.ObjectId, ref: 'clinic' }]
    });

var Dentist = mongoose.model('dentist', dentistSchema);
export { Dentist}; 
