import { Patient } from '../Models/patientSchema.js'

async function createPatient(inputPatient){

    try {
        if(
            !inputPatient?.Personnummer||
            !inputPatient?.Firstname||
            !inputPatient?.Lastname||
            !inputPatient?.password||
            !inputPatient?.email
        ){
            return{success: false,msg: 'credentials are missing'}
        }
        const newPatient = await new Patient({
            Personnummer: inputPatient.Personnummer,
            Firstname: inputPatient.Firstname,
            Lastname: inputPatient.Lastname,
            password: inputPatient.password,
            email: inputPatient.email
        });
        const savePatient = await Patient.create(newPatient);
        const res = { success: true, patient: savePatient };
        return res;
    }
    catch (error) {
        if (error.code === 11000) {
            console.error('Duplicate key error. Patient with the same Personnummer already exists.');
            const msg = 'Patient with the same Personnummer already exists.';
            return { success: false, msg: msg}
            
        } else {
            console.error('Error:', error);
            const msg = 'internal server error';
            return { success: false, msg: msg}
        }
    }
}

async function deletePatient(inputPatient){
    const patientNummer = inputPatient.Personnummer;
        try {
            const patients = await Patient.findOneAndDelete({ Personnummer: patientNummer }).exec();
            console.log('Deleted patient with personummer: ', patients);
        } catch (error) {
            console.error('Error ', error);
        }
}

async function queryPatients(inputPatient) {
    try {
        const patientId = inputPatient.patientId;
        const patient = await Patient.findById(patientId).select('-password');

        if(!patient) {
            return { success: false, msg: 'Patient not found' }
        }

        const res = { success: true, patient: patient };
        // Publish the response
        console.log('Queried patients:', patient);
        return res
    } catch (error) {
        const msg = 'internal server error';
        console.error('Error querying patients:', error);
        return {success: false, msg ,qos: RESPONSE_QOS}
    }
}

export default{
    createPatient,
    deletePatient,
    queryPatients
}