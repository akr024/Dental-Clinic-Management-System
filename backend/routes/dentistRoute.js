import express from 'express'
import { Dentist } from '../models/dentistModel.js'
const router = express.Router();

// Create New Dentist
router.post('/', async(req,res) => {
    try {
        if(
            !req.body.Personnummer ||
            !req.body.Firstname ||
            !req.body.Lastname ||
            !req.body.age||
            !req.body.password ||
            !req.body.email
        ){
            return res.status(404).send('Fill all fields');
        }
        const newDentist={
            Personnummer: req.body.Personnummer, 
            Firstname: req.body.Firstname,
            Lastname: req.body.Lastname,
            age: req.body.age,
            password: req.body.password, 
            email: req.body.email,
        }
        const result =  Dentist.create(newDentist);
        res.status(201).json(newDentist)
    } catch (error) {
        
    }

});

// Find dentist using Personnummer
router.get('/:Personnummer', async(req,res)=>{
    try {
        const dentistNumber = req.params.Personnummer
        const dentist = await Dentist.findOne({Personnummer:dentistNumber})
        if(!dentist){
        return res.status(404).send('Cannot find Dentist')
        }
        res.status(200).json(dentist)
        
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went wrong')
    }
});

router.patch('/:Personnummer',async(req,res)=>{
    try {
        const dentistNumber = req.params.Personnummer
        const dentist = await Dentist.findOne({Personnummer:dentistNumber});
        if(!dentist){
            return res.status(404).send('Dentist not found')
        }
        if (req.body.Firstname) dentist.Firstname = req.body.Firstname;
        if (req.body.Lastname) dentist.Lastname = req.body.Lastname;
        if (req.body.age) dentist.age = req.body.age;
        if (req.body.password) dentist.password = req.body.password;
        if (req.body.email) dentist.email = req.body.email;

    await dentist.save();
    res.status(200).json(dentist);
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went wrong :(')
    }
});

router.delete('/:Personnummer', async (req,res) => {
    try {
        const dentistNumber = req.params.Personnummer
        const dentist = await Dentist.findOneAndDelete({Personnummer:dentistNumber})
        if(!dentist){
            return res.status.send('Dentist not found')
        }
        res.status(200).send('Successfully deleted')
        
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went wrong :(')
    }
});

export default router;
