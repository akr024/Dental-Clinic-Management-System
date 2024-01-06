import express from 'express'
import {publishAwaitingResponse} from 'mqtt-service'
import { TOPIC_DENTIST_CREATE, TOPIC_DENTIST_MODIFY, TOPIC_DENTIST_QUERY } from '../config.js'
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
               res.status(201).json(response.newDentist)
            } else{
                res.status(400).json({msg: response.msg})
            } 
        })
    }
    } catch (error) {
        res.status(400).json({msg: 'dentist creation unsuccessful'})
    }

})

router.put('/',async(req,res)=>{
    const dentistUpdates = req.body
    try{
        let dentist;
        publishAwaitingResponse(TOPIC_DENTIST_QUERY,JSON.stringify(dentistUpdates.personnummer),(topic,payload,packet)=>{
            const response = JSON.parse(payload.toString());
            if(response.success){
                 dentist = response
            } else{
                res.status(404).json({msg: response.msg})
            }
            const updatedDentist = {
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