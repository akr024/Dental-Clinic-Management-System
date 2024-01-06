require("dotenv").config();
const readline = require("readline");
const axios = require("axios");
var { Dentist } = require("./models/dentistSchema.js");
var { Appointment } = require("./models/appointmentSchema.js");
require("./models/Patient.js");
require("./models/ClinicModel.js");
const mongoose = require("mongoose");
const moment = require("moment");

mongoose
  .connect(process.env.MONGODB_URI)
  .then()
  .catch((err) => console.error("MongoDB connection error:", err));

const regexHour = /^[0-2][0-9]:[0-5][0-9]$/;
const regexDate = /^\d{2}\/\d{2}\/\d{4}$/;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}
//should be done in the dentist api, just here temporarly
async function createDentist(dentistData) {
  try {
    const dentist = await Dentist.create(dentistData);
    return dentist? dentist._id : null;
  } catch (error) {
    console.error("Error creating dentist:", error);
    throw error;
  }
}
async function registerDentist() {
  const username = await askQuestion("Enter username: ");
  const personnummer = await askQuestion("Enter personnummer: ");
  const firstname = await askQuestion("Enter first name: ");
  const lastname = await askQuestion("Enter last name: ");
  const email = await askQuestion("Enter email: ");
  const password = await askQuestion("Enter password: ");

  const dentistData = {
    username,
    personnummer,
    firstname,
    lastname,
    email,
    password,
  };
  
  try {
    const dentistId = await createDentist(dentistData);
    if(dentistId){
      console.log("Dentist with id " , dentistId, " created succesfully");
    }
    
  } catch (error) {
    console.error("An error occurred:", error.response?.data || error.message);
  } finally {
    // After handling registration, go back to the main menu
    showMainMenu();
  }
}
async function checkCredentials() {
  const username = await askQuestion("Enter username: ");
  const password = await askQuestion("Enter password: ");
  const dentist = await Dentist.findOne({ username: username, password:password }).populate("clinics");;

  if (dentist) {
    return dentist;
  }
  return null;
}
async function findAppointmentsByDentist(dentistId) {
  try {
    const appointments = await Appointment.find({
      dentistId: dentistId,
    }).populate("patient").populate("clinicId");
    return appointments.length > 0 ? appointments : null;
  } catch (error) {
    console.error("Error finding appointments by dentist:", error);
    throw error;
  }
}
async function viewBookedAppointments(dentistId) {
  try {
    const appointments = await findAppointmentsByDentist(dentistId);

    if (appointments) {
      // Format appointments for tabular display
      const formattedAppointments = appointments.filter(appointment => !appointment.availability).map //filters out the availability = true (if the appointment is not booked by a patient)
      ((appointment) => {
        const patientName =
          appointment.patient?.Firstname + " " + appointment.patient?.Lastname;
        const clinicName = appointment.clinicId?.name;
        return {
          patient: patientName || "Unknown Patient",
          dateTime: moment(appointment.dateTime).format("YYYY-MM-DD HH:mm:ss"),
          clinicName: clinicName || "Unknown Clinic"
        };
      });
      // Print the formatted appointments as a table
      console.table(formattedAppointments);
    } else {
      console.log("No appointments found.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Call showMainMenu() after viewAppointments finishes execution
    showMainMenu();
  }
}
async function registerClinic(dentist) {
  const name = await askQuestion("Enter clinic name: ");
  const address = await askQuestion("Enter address: ");

  const clinicData = {
    name,
    address,
  };
  //api url for dentist api, clinics
  const apiUrl = "http://localhost:8080/clinics";

  try {
    const response = await axios.post(apiUrl, clinicData);
    console.log("Created clinic:", response.data.name);
    let clinicId = response.data._id
    dentist.clinics.push(clinicId);
    await dentist.save();
    console.log("Updated dentist:",dentist.firstname)
  } catch (error) {
    console.error("An error occurred:", error.response?.data || error.message);
  } finally {
    showMainMenu();
  }
}
async function joinClinic(dentist) {
  try {
    const apiUrl = "http://localhost:8080/clinics";
    const response = await axios.get(apiUrl);
    const clinicsData = response.data
    for (let i = 0; i < clinicsData.length; i++) {
      console.log(`${i + 1}. ${clinicsData[i].name}`);
    }
  
    let choice;
    do {
      choice = parseInt(await askQuestion("Choose the clinic you want to join:"));
    } while (choice < 1 || choice > clinicsData.length);
  
    const selectedClinic = clinicsData[choice - 1];
    console.log(`You selected clinic: ${selectedClinic.name}`);
    clinicId = selectedClinic._id;
    const isClinicAlreadyAdded = dentist.clinics.some(clinic => clinic === clinicId);
    if (!isClinicAlreadyAdded) {
      dentist.clinics.push(clinicId);
      await dentist.save();
      console.log(`Clinic with ID ${clinicId} added to dentist with ID ${dentist._id}`);
    } else {
      console.log(`Clinic with ID ${clinicId} is already in the dentist's list`);
    }
  } catch (error) {
    console.error("An error occurred:", error.response?.data || error.message);
  } finally {
    showMainMenu();
  }
}
async function createTimeAppointment(dentist) {
  let hour;
  let date;
  let dentistId=dentist._id;
  do {
    hour = await askQuestion("Enter hour HH:MM: ");
  } while (!regexHour.test(hour));

  do {
    date = await askQuestion("Enter date MM/DD/YYYY: ");
  } while (!regexDate.test(date));
  console.log("Date is",date)
  const dateTime = new Date(`${date} ${hour}`);
  //get dentist clinics and prompt them
  const apiUrl = "http://localhost:8080/appointments";

  try {
    if(dentist.clinics.length == 0){
      throw new Error('This dentist has no clinic registered');
    }
    for (let i = 0; i < dentist.clinics.length; i++) {
      console.log(`${i + 1}. ${dentist.clinics[i].name}`);
    }
  
    let choice;
    do {
      choice = parseInt(await askQuestion("Choose the clinic you want to join:"));
    } while (choice < 1 || choice > dentist.clinics.length);
  
    const clinicId = dentist.clinics[choice - 1]._id;
    const appointmentData = {
      dateTime,
      dentistId,
      clinicId
    };
    const response = await axios.post(apiUrl, appointmentData);
    console.log("Created appointment with id:", response.data._id);
  } catch (error) {
    console.error("An error occurred:", error.response?.data || error.message);
  } finally {
    showMainMenu();
  }
}

function showMainMenu() {
  console.log("Welcome to the Dentist UI");
  console.log("1. Register as a Dentist");
  console.log("2. View Appointments");
  console.log("3. Register clinic");
  console.log("4. Create time appointment slot");
  console.log("5. Join clinic");
  console.log("6. Exit");
  rl.question("Enter your choice: ", async (choice) => {
    switch (choice.trim()) {
      case "1":
        await registerDentist();
        break;
      case "2":
        var dentist = await checkCredentials();
        if (dentist) {
          await viewBookedAppointments(dentist._id);
        } else {
          console.log("Invalid credentials");
          showMainMenu();
        }
        break;
      case "3":
        var dentist = await checkCredentials();
        if (dentist) {
          await registerClinic(dentist);
        } else {
          console.log("Invalid credentials");
          showMainMenu();
        }
        break;
      case "4":
        var dentist = await checkCredentials();
        if (dentist) {
          await createTimeAppointment(dentist);
        } else {
          console.log("Invalid credentials");
          showMainMenu();
        }
        break;
      case "5":
        var dentist = await checkCredentials();
        if (dentist) {
          await joinClinic(dentist);
        } else {
          console.log("Invalid credentials");
          showMainMenu();
        }
        break;
      case "6":
        rl.close();
        break;
      default:
        console.log("Invalid choice, please try again.");
        showMainMenu();
    }
  });
}

rl.on("close", () => {
  console.log("Exiting the Dentist UI.");
  process.exit(0);
});

showMainMenu();