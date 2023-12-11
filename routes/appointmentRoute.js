import express from 'express'
import { publishAwaitingResponse } from 'mqtt-service'

const TOPIC_APPOINTMENT_BOOK = 'appointment/book'

const router = express.Router()

router.post('/:id/book', async (req, res) => {
  try {
    const query = {
      appointmentId: req.params.id,
      patientId: req.user._id
    }
    publishAwaitingResponse(TOPIC_APPOINTMENT_BOOK, JSON.stringify(query), (topic, payload, packet) => {
      let response = JSON.parse(payload.toString())
      if (response.success) {
        res.status(204).end()
      } else {
        res.status(400).json({ msg: response.msg })
      }
    })
  } catch (error) {
    console.log(error.stack)
    return res.status(500).json({ msg: 'internal server error' })
  }
})

export default router
