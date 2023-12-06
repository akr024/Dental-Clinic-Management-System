import { Notification } from '../models/notificationModel.js'
"use strict";
const nodemailer = require("nodemailer");

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
  let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "dentistplatform@gmail.com",
        pass: "DentistPlatform123#",
      },
    });

    let info = await transporter.sendMail({
      from: '"Dental Platform" <notifications@dentalplatform.com>', // sender address
      to: object.to, // list of receivers
      subject: object.title, // Subject line
      text: object.desc // plain text body
    });

    console.log("Message sent: %s", info.messageId);
}

export default {
  createNotificationDentist,
  createNotificationPatient
}
