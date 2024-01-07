import express from 'express'
import {publishAwaitingResponse} from 'mqtt-service'
const router = express.Router();
const appointment_publish_retrieve = 'appointments/retrieve'

router.get('/:id/appointments', (req, res) => {

    const dentistId = req.params.id
    publishAwaitingResponse(appointment_publish_retrieve, JSON.stringify({ dentistId: dentistId }), (topic, payload, packet) => {
        try {
      const response = JSON.parse(payload.toString())
      if (response.success) {
        res.status(200).json(response)
      } else {
        res.status(400).json(response.msg)
      }
    } catch (error) {
        console.error('Error ', error);
    }
    })
})

export default router