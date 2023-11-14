import express from "express";
import {Clinic} from '../models/clinicModel.js'
import { errorMessage500,errorMessage400 } from './error.js';
const router = express.Router()

router.post('/', async (req,res) => {
    try {
        if(!req.body.name){
            return res.status(400).send('Clinic name is missing')
        }
        const newClinic = { name: req.body.name}
        const result = Clinic.create(newClinic)
        res.status(201).send(newClinic)
    } catch (error) {
        console.log(error)
        return res.status(500).send(errorMessage500)
    }
});

router.get('/:id', async(req,res) => {
    try {
        const clinicID = req.params.id
        const clinic = await Clinic.findById(clinicID)
        if(!clinic){
            return req.status(404).json({message:'Clinic not found'})
        }
        res.status(200).send({clinic})
    } catch (error) {
        console.log(error)
        return res.status(500).send(errorMessage500)
    }
    
});

router.patch('/:id', async(req,res) => {
    try {
        const clinicID = req.params.id
        const clinic = await Clinic.findById(clinicID)
        if(!clinic){
             return req.status(404).send('Clinic not found')
        }
        if(req.body.name)clinic.name=req.body.name
        await clinic.save()
        res.status(200).json(clinic);
    } catch (error) {
        console.log(error)
        return res.status(500).send(errorMessage500)
    }
});

router.delete('/:id', async(req,res)=>{
    try {
        const clinicID = req.params.id
        const clinic = await Clinic.findByIdAndDelete(clinicID)
        if(!clinic){
             return req.status(404).send('Clinic not found')
        }
        res.status(204).end()
    } catch (error) {
        console.log(error)
        return res.status(500).send(errorMessage500)
    }
})

export default router;