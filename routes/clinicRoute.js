import express from 'express'
import { publishAwaitingResponse } from 'mqtt-service'

const TOPIC_CLINIC_QUERY = 'clinic/query'

const TOPIC_REVIEW_QUERY = 'review/query'

const TOPIC_APPOINTMENT_QUERY = 'appointment/query'

const router = express.Router()

router.get('/', (req, res) => {
  try {
    const query = { appointments: {} }

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

router.get('/:id/appointments', (req, res) => {
  try {
    const query = {
      clinicId: req.params.id,
      minDate: req.query.minDate,
      maxDate: req.query.maxDate
    }

    publishAwaitingResponse(TOPIC_APPOINTMENT_QUERY, JSON.stringify(query), (topic, payload) => {
      let response = JSON.parse(payload.toString())
      if (response.success) {
        setTimeout(() => res.json({ appointments: response.appointments }), 1)
      } else {
        res.status(400).json({ msg: response.msg })
      }
    })
  } catch (error) {
    console.log(error.stack)
    return res.status(500).json({ msg: 'internal server error' })
  }
})

router.get('/:id/reviews', (req, res) => {

  const clinicID = req.params.id

  publishAwaitingResponse(TOPIC_REVIEW_QUERY, JSON.stringify({ clinicId: clinicID }), (topic, payload, packet) => {

    const response = JSON.parse(payload.toString())
    console.log(response);
    if (response.success) {
      res.status(201).json(response)
    } else {
      res.status(400).json(response.msg)
    }

  })
})

export default router
