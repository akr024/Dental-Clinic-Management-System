import mongoose, { mongo } from "mongoose";

const clinicSchema = mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },
    employedDentist:{
        type:[
            {
                type: mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'dentist'
            }
        ]
    },
    clinicReviews:{
        type:[
            {
                type: mongoose.Schema.Types.ObjectId,
                required:true,
                ref:'review'
            }
        ]
    }
});

export const Clinic = mongoose.model('clinic',clinicSchema);