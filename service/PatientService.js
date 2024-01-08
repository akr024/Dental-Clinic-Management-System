import { Patient } from '../Models/patientSchema.js'

async function createPatient(inputPatient){

    try {
        if(
            !inputPatient?.personnummer||
            !inputPatient?.firstName||
            !inputPatient?.lastName||
            !inputPatient?.password||
            !inputPatient?.email
        ){
            return{success: false,msg: 'credentials are missing'}
        }
        const newPatient = await new Patient({
            personnummer: inputPatient.personnummer,
            firstName: inputPatient.firstName,
            lastName: inputPatient.lastName,
            password: inputPatient.password,
            email: inputPatient.email
        });
        const savePatient = await Patient.create(newPatient);
        const res = { success: true, patient: savePatient };
        return res;
    }
    catch (error) {
        if (error.code === 11000) {
            const msg = 'Patient with the same Personnummer already exists.';
            return { success: false, msg: msg}
            
        } else {
            const msg = 'internal server error';
            return { success: false, msg: msg}
        }
    }
}

async function deletePatient(inputPatient){
    const patientNummer = inputPatient.personnummer;
        try {
            const patients = await Patient.findOneAndDelete({ personnummer: patientNummer }).exec();
            if(!patients){
                return {msg: "cannot find patient", success: false}
            }
            return {msg: `Deleted patient with personummer: ${patientNummer}`, "success": true}
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
        return {success: false, msg}
    }
}

export default{
    createPatient,
    deletePatient,
    queryPatients
}