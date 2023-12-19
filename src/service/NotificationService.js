import { Notification } from '../models/notificationModel.js'
require("dotenv").config();
const nodemailer = require("nodemailer");

async function createNotificationAccountDeletion(inputData){
    try{        
        const newNotificationAccountDeletion = await new Notification({
            title: `Account ${inputData.accountId} Deletion Confirmation`,
            time: new Date(),
            desc: `Account with ID: ${inputData.accountId} has been deleted from the platform. Sad to see you go :(`,
            to: inputData.accountEmail
        }).save()

        sendEmail(newNotificationAccountDeletion);

        return { success: true, newNotificationDoctor }

    } catch (err){
        console.log(err.stack)
        return { success: false, msg: 'internal server error' }
    }
}

async function createNotificationDentist(inputData) {
    try{
        const dateTime = new Date(inputData.dateTime)
        
        const newNotificationDoctor = await new Notification({
            title: `Appointment booked on ${dateTime}`,
            time: new Date(),
            desc: `Appointment for Dentist (${inputData.dentistId}) has been booked at clinic (${inputData.clinicId}) by Patient (${inputData.patientId})`,
            to: inputData.dentistEmail
        }).save()

        sendEmail(newNotificationDoctor);

        return { success: true, newNotificationDoctor }

    } catch (err){
        console.log(err.stack)
        return { success: false, msg: 'internal server error' }
    }
}

async function createNotificationPatient(inputData) {
    try{
        const dateTime = new Date(inputData.dateTime)

        const newNotificationPatient = await new Notification({
            title: `Appointment (${inputData.appointmentId}) cancelled`,
            time: new Date(),
            desc: `Appointment with ID: ${inputData.appointmentId} has been cancelled at clinic (${inputData.clinicId}) by Dentist (${inputData.dentistId})`,
            to: inputData.patientEmail
        }).save()

        sendEmail(newNotificationPatient);

        return { success: true, newNotificationDoctor }
    } catch (err) {
        console.log(err.stack)
        return {success: false, msg: 'internal server error'}
    }
}

async function sendEmail(object) {
    try{
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.USER,
                pass: process.env.ACCESS_TOKEN //access token obtained using 2FA
            }
            });
    
        let info = await transporter.sendMail({
            from: 'Notification Service <x>',
            to: object.to,
            subject: object.title,
            text: object.desc
        });
    
        console.log("Message sent: %s", info.messageId);

    } catch(err){
        console.log(err.stack)
        return {success: false, msg: 'internal mail error'}
    }
}

export default {
  createNotificationDentist,
  createNotificationPatient,
  createNotificationAccountDeletion
}
