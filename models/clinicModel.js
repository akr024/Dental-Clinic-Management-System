import mongoose, { mongo } from "mongoose";
import { Review } from "./reviewModel.js";

const clinicSchema = mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },
    clinicReviews: [Review.schema]
    
});

export const Clinic = mongoose.model('clinic',clinicSchema);