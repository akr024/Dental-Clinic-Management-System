require("dotenv").config();
const readline = require("readline");
const axios = require("axios");
var { Dentist } = require("./models/dentistSchema.js");
var { Appointment } = require("./models/appointmentSchema.js");
require("./models/Patient.js");
const mongoose = require("mongoose");
const moment = require("moment");

mongoose
  .connect(process.env.MONGODB_URI)
  .then()
  .catch((err) => console.error("MongoDB connection error:", err));

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
  const dentist = await Dentist.findOne({ username: username, password:password });

  if (dentist) {
    return dentist._id;
  }
  return null;
}
async function findAppointmentsByDentist(dentistId) {
  try {
    const appointments = await Appointment.find({
      dentistId: dentistId,
    }).populate("patient");
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

        return {
          patient: patientName || "Unknown Patient",
          dateTime: moment(appointment.dateTime).format("YYYY-MM-DD HH:mm:ss"),
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
async function registerClinic() {
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
  } catch (error) {
    console.error("An error occurred:", error.response?.data || error.message);
  } finally {
    showMainMenu();
  }
}

function showMainMenu(clearConsole) {
  console.log("Welcome to the Dentist UI");
  console.log("1. Register as a Dentist");
  console.log("2. View Appointments");
  console.log("3. Register clinic");
  console.log("4. Exit");
  rl.question("Enter your choice: ", async (choice) => {
    switch (choice.trim()) {
      case "1":
        await registerDentist();
        break;
      case "2":
        var dentistId = await checkCredentials();
        if (dentistId) {
          await viewBookedAppointments(dentistId);
        } else {
          console.log("Invalid credentials");
          showMainMenu();
        }
        break;
      case "3":
        var dentistId = await checkCredentials();
        if (dentistId) {
          await registerClinic();
        } else {
          console.log("Invalid credentials");
          showMainMenu();
        }
        break;
      case "4":
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
