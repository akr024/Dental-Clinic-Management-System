import { Review } from '../models/ReviewModel.js'
import { Clinic } from '../models/ClinicModel.js'



async function createReview(review) {
    try {
        if (!review?.patientId || !review?.clinicId || !review?.reviewMsg || !review?.rating) {
            return { success: false, msg: 'Data required' }
        }


        const clinic = await Clinic.findById(review.clinicId)

        if (!clinic) {
            return { success: false, msg: `Clinic with id ${review.clinicId} doesn't exist` }
        }

        const newReview = await new Review({
            clinicId: review.clinicId,
            patientId: review.patientId,
            reviewMsg: review.reviewMsg,
            dateTime: review.dateTime,
            rating: review.rating
        });

        const savedReview = await newReview.save();

        clinic.review.push(savedReview);
        await clinic.save()

        return { success: true, review: savedReview }
    } catch (err) {
        console.log(err.stack)
        return { success: false, msg: 'internal server error' }
    }
}

async function queryReview(query) {
    return Clinic.findById(query.clinicId)
        .select('_id name address review')
        .populate({
            path: 'review'
        })
        .then(result => ({ success: true, clinics: result }))

}

export default {
    createReview,
    queryReview
}