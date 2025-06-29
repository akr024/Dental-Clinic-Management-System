import PatientService from "../service/PatientService.js"
import { Patient } from "../Models/patientSchema.js"
import { jest } from '@jest/globals'


import mockingoose from "mockingoose"

describe("PatientService",()=>{
    beforeEach(()=>{
        jest.clearAllMocks()
    })

    describe('createPatient',()=>{

        it('should return error message if credentials are missing',async()=>{
            const input = {}
            const expected = {success: false,msg: 'credentials are missing'}
            const result = await PatientService.createPatient(input)
            expect(result).toEqual(expected)
        })
        it('should return an error if patient already exists',async()=>{
            const input = {
                personnummer: "0312075632",
                firstName: "John",
                lastName: "Doe",
                password: "pass200",
                email : "doejohn@gmail.com"
            }
            jest.spyOn(Patient, 'create').mockRejectedValue({ code: 11000 });
            const result = await PatientService.createPatient(input);
            const expected = {success: false, msg: 'Patient with the same Personnummer already exists.'}
            expect(result).toEqual(expected);
          });
        it('should create a new patient',async()=>{
            const inputPatient = {
                personnummer: "0312075632",
                firstName: "John",
                lastName: "Doe",
                password: "pass200",
                email : "doejohn@gmail.com"
              };
        
              jest.spyOn(Patient, 'create').mockResolvedValueOnce({
                personnummer: "0312075632",
                firstName: "John",
                lastName: "Doe",
                password: "pass200",
                email : "doejohn@gmail.com"
              });
          
              const result = await PatientService.createPatient(inputPatient);
              const expected = {success: true, patient: inputPatient}
              expect(result).toEqual(expected)
            });
        })
    describe('deletePatient',()=>{

        it('should return an error if patient is not found', async()=>{
            const input = {
                personnummer: "0312075632",
                firstName: "John",
                lastName: "Doe",
                password: "pass200",
                email : "doejohn@gmail.com"
            }
        const expected = { success: false, msg:"cannot find patient"}
        mockingoose(Patient).toReturn(null,'findOneAndDelete')
        const result = await PatientService.deletePatient(input);
        expect(result).toEqual(expected)
        })

        it('should delete patient',async()=>{
            const input = {
                personnummer: "0312075632",
                firstName: "John",
                lastName: "Doe",
                password: "pass200",
                email : "doejohn@gmail.com"
            }
            
            const expected = {success: true, msg: `Deleted patient with personummer: ${input.personnummer}`}
            mockingoose(Patient).toReturn(input,'findOneAndDelete')
            const result = await PatientService.deletePatient(input)
            expect(result).toEqual(expected)
        })
    })

    describe('queryPatients',()=>{

        it('should return an error if patient is not found',async ()=>{
            const input = {
                personnummer: "0312075632",
                firstName: "John",
                lastName: "Doe",
                password: "pass200",
                email : "doejohn@gmail.com"
            }
           const expected =  { success: false, msg: 'Patient not found' }
           mockingoose(Patient).toReturn(null,'findById')
           const result = await PatientService.queryPatients(input);
           expect(result).toEqual(expected)
        })
    })
})