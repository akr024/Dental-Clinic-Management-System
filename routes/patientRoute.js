import {initializeMqttUsingEnvVariables,publishAwaitingResponse, subscribe} from 'mqtt-service'
import {patient_publish_create, patient_subscribe_create} from '../config.js'
import express from 'express'
const router = express.Router()


initializeMqttUsingEnvVariables()

router.post('/',async(req,res)=>{
try {
    console.log("entering if loop")
    if(
        !req.body.Personnummer||
        !req.body.Firstname||
        !req.body.Lastname||
        !req.body.password||
        !req.body.email
    ){
        res.status(400).json({msg:'Credentials are missing'})
    }
        console.log("creating new patient")
        const newPatient = {
            Personnummer: req.body.Personnummer,
            Firstname: req.body.Firstname,
            Lastname: req.body.Lastname,
            password: req.body.password,
            email: req.body.email
        }
        
        publishAwaitingResponse(patient_publish_create,JSON.stringify({Personnummer:Personnummer}), (patient_subscribe_create,payload,packet) =>{

            if(JSON.stringify(payload) === 'could not find'){
                publish(patient_publish_create,JSON.stringify(newPatient))
                res.status(201).json({msg:'Patient created and published successfully'})
            } else{
                res.status(409).json({msg:'Account already exists'})

            }
        })
} catch (error) {
    return res.status(500).json({msg:'patient creation unsuccessful'})
}
})

 export default router
