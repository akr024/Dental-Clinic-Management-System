import DentistService from "../service/DentistService.js";
import { Dentist } from "../Models/dentistSchema.js";
import { jest } from '@jest/globals'

import mockingoose from "mockingoose"

describe('DentistService', ()=>{
    beforeEach(()=>{
        jest.clearAllMocks()
    })

    describe('createDentist',()=>{
        it('should return error message if credentials are missing',async()=>{
            const input = {}
            const expected = {success: false,msg: 'credentials are missing'}
            const result = await DentistService.createDentist(input)
            expect(result).toEqual(expected)
        })
        it('should create a new dentist',async()=>{
            const inputDentist = {
                _id: '6568c3cf53596018c06d775d',
                username: "user200",
                personnummer: "0312075632",
                firstName: "John",
                lastName: "Doe",
                password: "pass200",
                email : "doejohn@gmail.com"
              };
          
              jest.spyOn(Dentist, 'create').mockResolvedValueOnce({
                _id: '6568c3cf53596018c06d775d',
                username: "user200",
                personnummer: "0312075632",
                firstName: "John",
                lastName: "Doe",
                password: "pass200",
                email : "doejohn@gmail.com"
              });
          
              const result = await DentistService.createDentist(inputDentist);
              const expected = {success:true, dentist: inputDentist}
              expect(result).toEqual(expected)
            });
    })
    describe('queryDentists',()=>{
        it('should return an error if dentist is not found',async ()=>{
            const input = {
                username: "user200",
                personnummer: "0312075632",
                firstName: "John",
                lastName: "Doe",
                password: "pass200",
                email : "doejohn@gmail.com"
            }
           const expected =  { success: false, msg: 'Dentist not found' }
           mockingoose(Dentist).toReturn(null,'findById')
           const result = await DentistService.queryDentists(input);
           expect(result).toEqual(expected)
        })
    })
    describe('modifyDentist',()=>{
        it('should modify dentist object',async()=>{
            const newDentist = {
                dentistId: '6568c3cf53596018c06d775d',
                username: "user200",
                personnummer: "0312075632",
                firstName: "Jane",
                lastName: "Doe",
                password: "pass200",
                email : "doejane@gmail.com"
              };
          
              const oldDentist = {
                _id: '6568c3cf53596018c06d775d',
                username: "user200",
                personnummer: "0312075632",
                firstName: "John",
                lastName: "Doe",
                password: "pass200",
                email : "doejohn@gmail.com"
              };
          
              jest.spyOn(Dentist, 'findById').mockResolvedValueOnce(oldDentist);
          
              jest.spyOn(Dentist, 'updateOne').mockResolvedValueOnce({ nModified: 1 });
          
              const result = await DentistService.modifyDentist(newDentist);
              const expected = {success: true, dentist: newDentist}
              })
        
    })
})

