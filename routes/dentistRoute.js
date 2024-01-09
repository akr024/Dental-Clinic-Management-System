import express from 'express'
import {publishAwaitingResponse} from 'mqtt-service'
import { TOPIC_DENTIST_CREATE, TOPIC_DENTIST_MODIFY, TOPIC_DENTIST_QUERY } from '../config.js'

const router = express.Router();
const appointment_publish_retrieve = 'appointments/retrieve'
router.get('/:id/appointments', (req, res) => {

    const dentistId = req.params.id
    publishAwaitingResponse(appointment_publish_retrieve, JSON.stringify({ dentistId: dentistId }), (topic, payload, packet) => {
        try {
      const response = JSON.parse(payload.toString())
      if (response.success) {
        res.status(200).json(response)
      } else {
        res.status(400).json(response.msg)
      }
    } catch (error) {
        console.error('Error ', error);
    }
    })
})


router.post('/', async (req, res) => {
    try {
        if (
            !req.body.username ||
            !req.body.personnummer ||
            !req.body.firstName ||
            !req.body.lastName ||
            !req.body.password ||
            !req.body.email
        ) {
            res.status(400).json({ msg: 'Credentials are missing' });
            return;
        }

        const newDentist = {
            username: req.body.username,
            personnummer: req.body.personnummer,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            email: req.body.email,
        };
        console.log(newDentist)
        publishAwaitingResponse(TOPIC_DENTIST_CREATE, JSON.stringify(newDentist), (topic, payload, packet) => {
            const response = JSON.parse(payload.toString());
            if (response.success) {
                res.status(201).json(response.newDentist);
            } else {
                res.status(400).json({ msg: response.msg });
            }
        });
    } catch (error) {
        res.status(500).json({ msg: 'Dentist creation unsuccessful' });
    }
});


router.put('/',async(req,res)=>{
    const dentistUpdates = req.body
    try{
        let dentist;
        publishAwaitingResponse(TOPIC_DENTIST_QUERY,JSON.stringify(dentistUpdates._id),(topic,payload,packet)=>{
            const response = JSON.parse(payload.toString());
            if(response.success){
                 dentist = response
            } else{
                res.status(404).json({msg: response.msg})
            }
            const updatedDentist = {
                username: dentist.username,
                personnummer : dentist.personnummer,
                firstName: dentistUpdates.firstName? dentistUpdates.firstName: dentist.firstName,
                lastName: dentistUpdates.lastName?dentistUpdates.lastName:dentist.lastName,
                password: dentistUpdates.password?dentistUpdates.password:dentist.password,
                email: dentistUpdates.email?dentistUpdates.email:dentist.email
            }
            publishAwaitingResponse(TOPIC_DENTIST_MODIFY,JSON.stringify(updatedDentist),(topic,payload,packet)=>{
                if(response.success){
                    res.status(201).json(response.updatedDentist)
                 } else{
                     res.status(400).json({msg: response.msg})
                 } 
            })
        })


    } catch(error){

    }
})

export default router