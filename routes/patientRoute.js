import {initializeMqttUsingEnvVariables,publishAwaitingResponse, subscribe} from 'mqtt-service'
import {patient_publish_create, patient_publish_delete, patient_publish_query, patient_subscribe_create} from '../config.js'
import express from 'express'
import passport from '../utils/authConfig.js';

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
        return
    }
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

router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // only allow the patient to access their own data
    if (req.user._id !== req.params.id) {
        return res.status(401).json({ msg: 'unauthorized' })
    }

    publishAwaitingResponse(patient_publish_query, JSON.stringify({ patientId: req.params.id }), (topic, payload, packet) => {
        const response = JSON.parse(payload.toString())
        console.log(response)
        if (response.success) {
            res.status(200).json(response.patient)
        } else {
            res.status(400).json({msg: response.msg})
        }
    })
})

router.delete('/:Personnummer',async(req,res)=>{
    const patientNumber = req.params.Personnummer
    try {
        publishAwaitingResponse(patient_publish_delete,JSON.stringify({Personnummer:patientNumber})),(topic,payload,packet)=>{
            const response = JSON.parse(payload.toString())
            if(response.success){
                res.status(201).json(response)
            } else{
                res.status(400).json(response.msg)
            }
        }
    } catch (error) {
        return res.status(500).json({msg:'patient deletion unsuccessful'})
    }
    })

 export default router
