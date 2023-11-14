import express from 'express'
import {Patient} from '../models/patientsModel.js'
import { errorMessage500,errorMessage400 } from './error.js';
const router = express.Router();

// Create New Patient
router.post('/', async (req,res) => {
   try {
    if(
        !req.body.Personnummer ||
        !req.body.Firstname ||
        !req.body.Lastname ||
        !req.body.age||
        !req.body.password ||
        !req.body.email
    ){
        return res.status(400).send(errorMessage400);
    }
    const newPatient = {
        Personnummer: req.body.Personnummer,
        Firstname: req.body.Firstname,
        Lastname: req.body.Lastname,
        age: req.body.age,
        password: req.body.password,
        email: req.body.email

    };
    const result = Patient.create(newPatient);
    return res.status(201).send('New Patient Created');
   } catch (error) {
    console.log(error.message);
    res.status(500).send({message: error.message});
   } 
    
});

// Find a patient with personnummer
router.get('/:Personnummer', async (req,res) => {
    try {
        const patientNumber = req.params.Personnummer
        const patient = await Patient.findOne({Personnummer:patientNumber});
        if(!patient){
            return res.status(404).send('Patient not found');
        }
        res.status(200).json(patient)
        
    } catch (error) {
        console.log(error);
        return res.status(500).send(errorMessage500)
        
    }
});

// Update a Users info
router.patch('/:Personnummer', async (req,res) => {
    try {
        const patientNumber = req.params.Personnummer
        const patient = await Patient.findOne({Personnummer:patientNumber});
        if(!patient){
            return res.status(404).send('Patient not found')
        }
        if (req.body.Firstname) patient.Firstname = req.body.Firstname;
        if (req.body.Lastname) patient.Lastname = req.body.Lastname;
        if (req.body.age) patient.age = req.body.age;
        if (req.body.password) patient.password = req.body.password;
        if (req.body.email) patient.email = req.body.email;

    // Save the updated patient to the database
    await patient.save();
    res.status(200).json(patient);
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went wrong :(')
    }
});

// Delete a Users info
router.delete('/:Personnummer', async (req,res) => {
    try {
        const patientNumber = req.params.Personnummer
        const deletedPatient = await Patient.findOneAndDelete({Personnummer:patientNumber});
        if(!deletedPatient){
            return res.status(404).send('Patient not found')
        }
        res.status(200).send('deleted patient')
        
        
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went wrong :(')
    }

});


export default router;