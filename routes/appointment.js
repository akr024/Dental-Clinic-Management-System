import express from 'express'
import {publishAwaitingResponse} from 'mqtt-service'
import { appointment_publish_create } from '../config.js';
const router = express.Router();

router.post('/', async (req,res) => {
    try {
        console.log("entering if loop")
        if( 
            //!req.body.dateTime||
            !req.body.clinicId||
            !req.body.patientId||
            !req.body.dentistId
            ){
            res.status(400).json({msg:'Date and time is missing'})
        } else{
            console.log("creating new appointment")
            const newAppointment = {
                clinicId: req.body.clinicId,
                dentistId: req.body.dentistId,
                patientId: req.body.patientId,
                dateTime: req.body.dateTime
            }
            publishAwaitingResponse(appointment_publish_create,JSON.stringify(newAppointment),(topic,payload,packet)=>{
    
                const response = JSON.parse(payload.toString())
                if(response.success){
                    res.status(201).json(response.newAppointment)
                } else{
                    res.status(400).json(response.msg)
                }      
            })

        }
            
            
    } catch (error) {
        return res.status(500).json({msg:'appointment creation unsuccessful'})
    }       
})

export default router;