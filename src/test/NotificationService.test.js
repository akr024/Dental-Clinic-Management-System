import NotificationService from '../service/NotificationService.js';
import { jest } from '@jest/globals'

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(),
  })),
}));

describe('NotificationService', () => {

  describe('createNotificationCancel', () => {
    it('should create a notification for a cancelled appointment and send an email', async () => {
      // Mock the required data for the test
      const inputData = {
        appointmentId: '60d7e3e0a3b4e4a2c8a7e3d1',
        dateTime: '2024-01-08T12:00:00.000Z',
        dentistId: '6596f7ad45db317335994020',
        clinicId: 'clinicId',
        patient: '6569db7e8921f50e6fc08f60',
      };

      // Mock the expected result
      const expectedNotification = {
        title: `Appointment (60d7e3e0a3b4e4a2c8a7e3d1) on ${new Date(inputData.dateTime)} cancelled`,
        time: expect.any(Date),
        desc: `Appointment with ID: ${inputData.appointmentId} on ${new Date(inputData.dateTime)} has been cancelled at clinic (${inputData.clinicId}) by Dentist (${inputData.dentistId})`,
        to: ['dentistplatform2@gmail.com', 'dentistplatform2@gmail.com']
      };

      // Call the NotificationService function
      const result = await NotificationService.createNotificationCancel(inputData);
      console.log(result.newNotificationPatient);
      const result2 = {
        title: result.newNotificationPatient.title,
        time: result.newNotificationPatient.time,
        desc: result.newNotificationPatient.desc,
        to: result.newNotificationPatient.to
      }

      // Assert the result
      expect(result.success).toBe(true);
      expect(result2).toEqual(expectedNotification);
    });

    // Add more test cases as needed
  });
});