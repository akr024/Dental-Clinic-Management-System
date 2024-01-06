import express from 'express'
import {publishAwaitingResponse} from 'mqtt-service'
import { TOPIC_DENTIST_CREATE } from '../config.js'
const router = express.Router();

router.post('/',async(req,res)=>{
    try {
    if(
        !req.body.personnummer||
        !req.body.firstName||
        !req.body.lastName||
        !req.body.password||
        !req.body.email
    ){
        res.status(400).json({msg:'Credentials missing'})
    } else{
        const newDentist = {
            personnummer: req.body.personnummer,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            email: req.body.email
        }
        publishAwaitingResponse(TOPIC_DENTIST_CREATE,JSON.stringify(newDentist),(topic,payload,packet)=>{
            console.log('\x1b[95m%s\x1b[0m', '[Dentist JSON object sent from dentist API..]');
            const response = JSON.parse(payload.toString())
            if(response.success){
               res.status(201).json(response.clinic)
            } else{
                res.status(400).json({msg: response.msg})
            } 
        })
    }
    } catch (error) {
        res.status(400).json({msg: 'dentist creation unsuccessful'})
    }

})



export default router