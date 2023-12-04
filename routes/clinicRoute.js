import express from 'express'
import { publishAwaitingResponse } from 'mqtt-service'

const TOPIC_CLINIC_QUERY = 'clinic/query'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const query = { appointments: {} }

    if (req.query.onlyAvailable != undefined) {
      // Parse to convert the type from a string to a boolean in the json that is published. Because Boolean("false") === true -_-
      query.appointments.onlyAvailable = JSON.parse(req.query.onlyAvailable || false)
    }

    if (req.query.from) {
      query.appointments.from = req.query.from
    }

    if (req.query.to) {
      query.appointments.to = req.query.to
    }

    publishAwaitingResponse(TOPIC_CLINIC_QUERY, JSON.stringify(query), (topic, payload, packet) => {
      let response = JSON.parse(payload.toString())
      if (response.success) {
        res.json(response.clinics)
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
