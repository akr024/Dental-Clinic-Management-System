import { Dentist } from "../Models/dentistSchema.js";


async function createDentist(inputDentist){
    try {
        if(
            !inputDentist?.username||
            !inputDentist?.personnummer||
            !inputDentist?.firstName||
            !inputDentist?.lastName||
            !inputDentist?.password||
            !inputDentist?.email
        ){
            return{success: false,msg: 'credentials are missing'}
        }
        const newDentist = await new Dentist({
            username: inputDentist.username,
            personnummer: inputDentist.personnummer,
            firstName: inputDentist.firstName,
            lastName: inputDentist.lastName,
            password: inputDentist.password,
            email: inputDentist.email
        });
        const saveDentist = await Dentist.create(newDentist);
        const res = { success: true, dentist: saveDentist };
        return res;
    }
    catch (error) {
            console.error('Error:', error);
            const msg = 'internal server error';
            return { success: false, msg: msg}
    }
}
async function queryDentists(inputDentist) {
    try {
        const dentistId = inputDentist.dentistId;
        const dentist = await Dentist.findById(dentistId).select('-password');

        if(!dentist) {
            return { success: false, msg: 'Dentist not found' }
        }

        const res = { success: true, dentist: dentist };
        // Publish the response
        console.log('Queried Dentists:', dentist);
        return res
    } catch (error) {
        const msg = 'internal server error';
        console.error('Error querying Dentists:', error);
        return {success: false, msg ,qos: RESPONSE_QOS}
    }
}
async function modifyDentist(inputDentist) {
    try{
        const dentistInfo = inputDentist;
        const dentist = await Dentist.findById(dentistInfo.dentistId).select('-password');

        if(!dentist){
            return { success: false, msg: 'Dentist not found' }
        }
       const result = await Dentist.updateOne({dentistid: dentist.dentistId},{$set: dentistInfo})
       const res = { success: true, dentist: result };
       return res;
    } catch(error){
        const msg = 'internal server error';
        console.error('Error querying Dentists:', error);
        return {success: false, msg ,qos: RESPONSE_QOS}
    }
}

export default{
    createDentist,
    queryDentists,
    modifyDentist
}
