import express from 'express'
import {publishAwaitingResponse} from 'mqtt-service'
import { clinic_publish_create,clinic_query } from '../config.js';
const router = express.Router();


router.post('/', async (req, res) =>{

try {
    console.log('entering if loop');
    if(
        !req.body.name ||
        !req.body.address
    ){
        res.status(400).json({msg:'Name and address required'})
    }else{
        console.log('creating new clinic')
        const newClinic = {
            name: req.body.name,
            address: req.body.address
        }
        publishAwaitingResponse(clinic_publish_create,JSON.stringify(newClinic),(topic,payload,packet)=>{
    
            const response = JSON.parse(payload.toString())
            if(response.success){
               res.status(201).json(response.clinic)
            } else{
                res.status(400).json({msg: response.msg})
            }      
        })
    }
    
} catch (error) {
    
}
})

//GET clinics route added
router.get('/', async (req, res) =>{

    try {
        
            const newClinic = {
                name: req.body.name,
                address: req.body.address
            }
            publishAwaitingResponse(clinic_query,null,(topic,payload,packet)=>{
                console.log("Clinic controller")
                const response = JSON.parse(payload.toString())
                console.log("Response clinics is",response.clinics)
                if(response.success){
                   res.status(201).json(response.clinics)
                } else{
                    res.status(400).json({msg: response.msg})
                }      
            })
        
        
    } catch (error) {
        
    }
    })




export default router