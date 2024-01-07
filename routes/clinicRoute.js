import express from 'express'
import {publishAwaitingResponse} from 'mqtt-service'
import { TOPIC_CLINIC_CREATE} from '../config.js';
const router = express.Router();


router.post('/', async (req, res) =>{

try {
    if(
        !req.body.name ||
        !req.body.address
    ){
        res.status(400).json({msg:'Name and address required'})
    }else{
        const newClinic = {
            name: req.body.name,
            address: req.body.address
        }
        publishAwaitingResponse(TOPIC_CLINIC_CREATE,JSON.stringify(newClinic),(topic,payload,packet)=>{
            console.log('\x1b[95m%s\x1b[0m', '[Clinic JSON object sent from dentist API..]');
            const response = JSON.parse(payload.toString())
            if(response.success){
               res.status(201).json(response.clinic)
            } else{
                res.status(400).json({msg: response.msg})
            }      
        })
    }
} catch (error) {
    res.status(500).json({msg: 'clinic creation unsuccessful'})
}
})






export default router