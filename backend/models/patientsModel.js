import mongoose from "mongoose";

const patientSchema = mongoose.Schema(
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

export const Patient = mongoose.model('patient',patientSchema)