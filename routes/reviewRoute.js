import express from 'express'
import { Review } from '../models/reviewModel.js'
import { Clinic } from '../models/clinicModel.js';
import { errorMessage400,errorMessage500 } from './error.js';

const router = express.Router();

router.post('/:id', async(req,res)=>{
    try {
        if(
            !req.body.text ||
            !req.body.rating 
        ){
            return res.status(400).send('text or rating missing')
        }
        const clinicID = req.params.id
        const clinic = await Clinic.findById(clinicID)
        if(!clinic){
            return res.status(404).send('Cannot find clinic')
        }
        const newReview = {
            text: req.body.text,
            rating: req.body.rating,
            clinicID: clinicID
        }
        clinic.clinicReviews.push(newReview)
        clinic.save();
        res.status(200).json(newReview)
        
    } catch (error) {
        console.log(error)
        res.status(500).send(errorMessage500)
    }
    
});

router.get('/:id', async(req,res) => {
    try {
        const clinicID = req.params.id
        const clinic = await Clinic.findById(clinicID)
        if(!clinic){
            return res.status(404).send('Cannot find clinic')
        }
        res.status(200).json(clinic.clinicReviews)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send(errorMessage500)
    }
});

router.delete('/:clinicID/clinicReviews/:id', async(req,res)=>{
    
    try {
        const clinicID = req.params.clinicID
        const reviewID = req.params.id
        const updatedClinic = await Clinic.findByIdAndUpdate(
            clinicID,
            { $pull: { clinicReviews: { _id: reviewID } } },
            { new: true }
          );
        if (!updatedClinic) {
            return res.status(404).json({ message: 'Clinic not found' });
        }
        res.status(200).json(updatedClinic)
    } catch (error) {
        console.log(error)
        res.status(500).json(errorMessage500);
    }
})

export default router;