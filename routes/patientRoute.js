import {initializeMqttUsingEnvVariables,publishAwaitingResponse, subscribe} from 'mqtt-service'
import {patient_publish_create, patient_publish_query, patient_subscribe_create} from '../config.js'
import express from 'express'
const router = express.Router()



router.post('/',async(req,res)=>{
try {
    if(
        !req.body.personnummer||
        !req.body.firstName||
        !req.body.lastName||
        !req.body.password||
        !req.body.email
    ){
        res.status(400).json({msg:'Credentials are missing'})
    }
        console.log("creating new patient")
        const newPatient = {
            Personnummer: req.body.personnummer,
            Firstname: req.body.firstName,
            Lastname: req.body.lastName,
            password: req.body.password,
            email: req.body.email
        }
        publishAwaitingResponse(patient_publish_create,JSON.stringify(newPatient),(topic,payload,packet)=>{

            const response = JSON.parse(payload.toString())
            if(response.success){
                res.status(201).json(response.newPatient)
            } else{
                res.status(400).json(response.msg)
            }      
        })
        
} catch (error) {
    return res.status(500).json({msg:'patient creation unsuccessful'})
}
})

router.get('/:Personnummer',async(req,res)=>{

    const patientNumber = req.params.Personnummer

    publishAwaitingResponse(patient_publish_query,JSON.stringify({Personnummer:patientNumber}),(topic,payload,packet)=>{

        const response = JSON.parse(payload.toString())
            if(response.success){
                res.status(201).json(response)
            } else{
                res.status(400).json(response.msg)
            }   

    })
})


 export default router
