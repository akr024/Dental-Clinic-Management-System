import { publishResponse, subscribeShared } from 'mqtt-service'
import ReviewService from '../service/ReviewService.js'
import { errorHandlerDecorator } from './ErrorHandlerDecorator.js'

const SUBSCRIPTION_SHARE_NAME = 'appointment_service'

const TOPIC_REVIEW_CREATE = 'review/create'

const TOPIC_CLINIC_QUERY = 'review/querry'

const RESPONSE_QOS = 1

function handleReviewCreate(topic, payload, packet) {
    const review = JSON.parse(payload.toString())

    ReviewService.createReview(review)
        .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }))
}

function handleReviewQuery(topic, payload, packet) {
    const query = JSON.parse(payload)

    ReviewService.queryReview(query)
        .then(response => publishResponse(packet, JSON.stringify(response), { qos: RESPONSE_QOS }))
}

function initialize() {
    subscribeShared(SUBSCRIPTION_SHARE_NAME, TOPIC_REVIEW_CREATE, errorHandlerDecorator(handleReviewCreate, RESPONSE_QOS)),
        subscribeShared(SUBSCRIPTION_SHARE_NAME, TOPIC_CLINIC_QUERY, errorHandlerDecorator(handleReviewQuery, RESPONSE_QOS))

}

export default {
    initialize
}
