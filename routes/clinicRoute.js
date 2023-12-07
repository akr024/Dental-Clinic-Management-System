import express from 'express'
import {publishAwaitingResponse} from 'mqtt-service'
import { clinic_publish_create } from '../config.js';
const router = express.Router();


router.post('/', async (req, res) =>{

try {
    console.log('entering if loop');
    if(
        !req.body.name ||
        !req.body.position.lat||
        !req.body.position.lng||
        !req.body.address
    ){
        res.status(400).json({msg:'Missing credentials'})
    }else{
        console.log('creating new clinic')
        const newClinic = {
            name: req.body.name,
            lat: req.body.position.lat,
            lng: req.body.position.lng,
            address: req.body.address
        }
        publishAwaitingResponse(clinic_publish_create,JSON.stringify(newClinic),(topic,payload,packet)=>{
    
            const response = JSON.parse(payload.toString())
            if(response.success){
                res.status(201).json(response.newClinic)
            } else{
                res.status(400).json(response.msg)
            }      
        })
    }
    
} catch (error) {
    
}




})






export default router