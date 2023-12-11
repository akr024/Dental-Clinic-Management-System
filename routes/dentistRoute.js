import express from 'express'
import {publishAwaitingResponse} from 'mqtt-service'
import { dentist_publish_create } from '../config.js'
const router = express.Router();

router.post('/',async(req,res)=>{
    try {
        onsole.log('entering if loop');
    if(
        !req.body.Personnummer ||
        !req.body.Firstname ||
        !req.body.Lastname ||
        !req.body.password ||
        !req.body.email
    ){
        res.status(400).json({msg:'Credentials missing'})
    } else{
        console.log('creating new Dentist')
        const newDentist = {
            Personnummer: req.body.Personnummer,
            Firstname: req.body.Firstname,
            Lastname: req.body.Lastname,
            password: req.body.password,
            email: req.body.email
        }
        publishAwaitingResponse(dentist_publish_create,JSON.stringify(newDentist),(topic,payload,packet)=>{
            const response = JSON.parse(payload.toString())
            if(response.success){
               res.status(201).json(response.clinic)
            } else{
                res.status(400).json({msg: response.msg})
            } 
        })
    }
    } catch (error) {
        res.status(400).json({msg: error})
    }

})



export default router