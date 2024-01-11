import { Notification } from '../models/notificationModel.js';
import dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose';
import nodemailer from "nodemailer";
import { userDBConnection } from "../../app.js";

async function getEmailDentist(id) {
    try{
        const result = await userDBConnection.collection('dentists').findOne({ _id: new mongoose.Types.ObjectId(id) }, { projection: { "email": 1, "_id": 0 } });
        return result.email;
    } catch (err){
        console.log(err.stack)
        return { success: false, msg: 'internal email retrieval error' }
    }
}

async function getEmailPatient(id) {
    try{
        const result = await userDBConnection.collection('patients').findOne({ _id: new mongoose.Types.ObjectId(id) }, { projection: { "email": 1, "_id": 0 } });
        return result.email;
    } catch (err){
        console.log(err.stack)
        return { success: false, msg: 'internal email retrieval error' }
    }
}

async function createNotificationBook(inputData) {
    try{
        const dateTime = new Date(inputData.dateTime)
        
        const newNotificationDoctor = await new Notification({
            title: `Appointment booked on ${dateTime}`,
            time: new Date(),
            desc: `Appointment for Dentist (${inputData.dentistId}) has been booked at clinic (${inputData.clinicId}) by Patient (${inputData.patientId})`,
            to: [`${await getEmailDentist(inputData.dentistId)}`, `${await getEmailPatient(inputData.patientId)}`]
        }).save()

        sendEmail(newNotificationDoctor);

        return { success: true, newNotificationDoctor }

    } catch (err){
        console.log(err.stack)
        return { success: false, msg: 'internal server error' }
    }
}

async function createNotificationCancel(inputData) {
    try{
        const dateTime = new Date(inputData.dateTime)

        const newNotificationPatient = await new Notification({
            title: `Appointment (${inputData.appointmentId}) on ${dateTime} cancelled`,
            time: new Date(),
            desc: `Appointment with ID: ${inputData.appointmentId} on ${dateTime} has been cancelled at clinic (${inputData.clinicId}) by Dentist (${inputData.dentistId})`,
            to: [`${await getEmailDentist(inputData.dentistId)}`, `${await getEmailPatient(inputData.patientId)}`]
        }).save()

        sendEmail(newNotificationPatient);

        return { success: true, newNotificationPatient }
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
                user: process.env.EMAIL,
                pass: process.env.ACCESS_TOKEN
            }
            });
    
        let info = await transporter.sendMail({
            from: 'Notification Service <x>',
            to: object.to,
            subject: object.title,
            text: object.desc
        });
    
        console.log("Message sent: %s", info.response);
    } catch(err){
        console.log(err.stack)
        return {success: false, msg: 'internal mail error'}
    }
}

export default {
  createNotificationCancel,
  createNotificationBook
}
