import {model,Schema} from 'mongoose';

var dentistSchema = new Schema(
    {
        personnummer: {
            type: String,
            required: true,
            unique: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        password: {
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

var Dentist = model('Dentist', dentistSchema);
export { Dentist};