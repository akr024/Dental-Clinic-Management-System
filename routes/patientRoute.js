import {initializeMqttUsingEnvVariables,publish} from 'mqtt-service'
import {patient_publish_create} from '../config.js'
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
        !req.body.age||
        !req.body.password||
        !req.body.email
    ){
        res.status(400).json('Credentials are missing')
    }
        console.log("creating new patient")
        const newPatient = {
            Personnummer: req.body.Personnummer,
            Firstname: req.body.Firstname,
            Lastname: req.body.Lastname,
            age: req.body.age,
            password: req.body.password,
            email: req.body.email
        }
        
        publish(patient_publish_create,JSON.stringify(newPatient))
        res.status(201).json('Patient created and published successfully')
    
    
    
} catch (error) {
    return res.status(500).json('patient creation unsuccessful')
}
})

 export default router
