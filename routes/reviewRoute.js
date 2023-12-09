import { publishAwaitingResponse } from 'mqtt-service'
import express from 'express'
const router = express.Router()

const TOPIC_REVIEW_CREATE = 'review/create'


router.post('/', async (req, res) => {
    try {
        if (
            !req.body.clinicId ||
            !req.body.patientId ||
            !req.body.reviewMsg ||
            !req.body.rating ||
            req.body.rating < 0 || req.body.rating > 5
        ) {
            res.status(400).json({ msg: res })
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


export default router
