import mongoose, { mongo } from "mongoose";

const dentistSchema = mongoose.Schema(
{
    Personnummer: {
        type: Number,
        required:true
    },
    Firstname: {
        type: String,
        required:true
    },
    Lastname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true
    }
});

export const Dentist = mongoose.model('dentist',dentistSchema);