import { publishAwaitingResponse } from 'mqtt-service'
import express from 'express'
const router = express.Router()

const TOPIC_REVIEW_CREATE = 'review/create'

const TOPIC_REVIEW_QUERY = 'review/querry'

router.post('/', async (req, res) => {
    try {
        if (
            !req.body.clinicId ||
            !req.body.patientId ||
            !req.body.reviewMsg ||
            !req.body.rating
        ) {
            res.status(400).json({ msg: 'Input data required' })
            return
        }
        const newReview = {
            clinicId: req.body.clinicId,
            patientId: req.body.patientId,
            reviewMsg: req.body.reviewMsg,
            rating: req.body.rating,
            dateTime: req.body.dateTime
        }

        publishAwaitingResponse(TOPIC_REVIEW_CREATE, JSON.stringify(newReview), (topic, payload, packet) => {

            const response = JSON.parse(payload.toString())
            if (response.success) {
                res.status(201).json(response.newReview)
            } else {
                res.status(400).json(response.msg)
            }
        })

    } catch (error) {
        return res.status(500).json({ msg: 'review creation unsuccessful' })
    }
})

router.get('/clinics/:id', async (req, res) => {

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
