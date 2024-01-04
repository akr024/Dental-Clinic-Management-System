import { Notification } from '../models/notificationModel.js';
import dotenv from "dotenv";
dotenv.config();
import mongoose from 'mongoose';
import nodemailer from "nodemailer";

async function getEmail(id, userType) {
    try{
        if(userType==="dentist"){
            const result = await mongoose.connection.collection('dentists').findOne({ _id: new mongoose.Types.ObjectId(id) }, { projection: { "email": 1, "_id": 0 } });
        } else {
            const result = await mongoose.connection.collection('patients').findOne({ _id: new mongoose.Types.ObjectId(id) }, { projection: { "email": 1, "_id": 0 } });
        }
        return result.email;
    } catch (err){
        console.log(err.stack)
        return { success: false, msg: 'internal email retrieval error' }
    }
}

/*async function createNotificationAccountDeletion(inputData){
    try{        
        const newNotificationAccountDeletion = await new Notification({
            title: `Account ${inputData.accountId} Deletion Confirmation`,
            time: new Date(),
            desc: `Account with ID: ${inputData.accountId} has been deleted from the platform. Sad to see you go :(`,
            to: getEmail(inputData.accountId)
        }).save({ collection: 'notifications' })

        sendEmail(newNotificationAccountDeletion);

        return { success: true, newNotificationDoctor }

    } catch (err){
        console.log(err.stack)
        return { success: false, msg: 'internal server error' }
    }
} */

async function createNotificationDentist(inputData) {
    try{
        const dateTime = new Date(inputData.dateTime)
        
        const newNotificationDoctor = await new Notification({
            title: `Appointment booked on ${dateTime}`,
            time: new Date(),
            desc: `Appointment for Dentist (${inputData.dentistId}) has been booked at clinic (${inputData.clinicId}) by Patient (${inputData.patient})`,
            to: `${getEmail(inputData.dentistId, "dentist")}`
        }).save({ collection: 'notifications' })

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
            to: `${getEmail(inputData.patient, "patient")}`
        }).save({ collection: 'notifications' })

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
}
