require("dotenv").config();
const readline = require("readline");
const axios = require("axios");
var { Dentist } = require("./models/dentistSchema.js");
var { Appointment } = require("./models/appointmentSchema.js");
require("./models/Patient.js");
var {Clinic} = require("./models/ClinicModel.js");
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

// Violates the architecture - Directly interacts with MongoDB (using Dentist.create) to create a new dentist
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
    showMainMenu();
  }
}

// Doesn't violate the architecture - Sends a request to the authentication API (http://localhost:3000/api/auth/dentist/login) to check the credentials of a dentist
async function checkCredentials() {
  const personnummer = await askQuestion("Enter personnummer: ");
  const password = await askQuestion("Enter password: ");
  const apiUrl = "http://localhost:3000/api/auth/dentist/login";
  const dentistData = {
    personnummer,
    password,
  };
  try {
    const response = await axios.post(apiUrl, dentistData);
    let dentist = response.data
    if (dentist) {
      return dentist;
    }
    return null;
  } catch (error) {
    console.error("An error occurred:", error.response?.data || error.message);
  } 
}

// Violates the architecture - Uses Appointment.find to directly retrieve appointments for a specific dentist from the database
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

// Violates the architecture - Calls findAppointmentsByDentist to directly retrieve and display appointments for a dentist
async function viewBookedAppointments(dentistId) {
  try {
    const appointments = await findAppointmentsByDentist(dentistId);

    if (appointments) {
      const formattedAppointments = appointments.filter(appointment => !appointment.availability).map
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
      console.table(formattedAppointments);
    } else {
      console.log("No appointments found.");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    showMainMenu();
  }
}

// Violates the architecture - Creates a new clinic and associates it with a dentist by updating the dentist's information in the database
async function registerClinic(dentist) {
  try {
    const name = await askQuestion("Enter clinic name: ");
    const lng = await askQuestion("Enter longtitude: ");
    const lat = await askQuestion("Enter latitude: ");
    const address = await askQuestion("Enter address: ");

    const clinicData = {
      name: name,
      position: {
        lat: lat,
        lng: lng
      },
      address: address,
    };

    const clinic = new Clinic(clinicData);
    await clinic.save();
    console.log("Created clinic:", clinic.name);

    const dentist_new = await Dentist.findByIdAndUpdate(
      dentist._id,
      { $addToSet: { clinics: clinic._id } },
      { new: true }
    );

    console.log(`Clinic with ID: \x1b[32m${clinic._id}\x1b[0m added to dentist with ID: \x1b[32m${dentist._id}\x1b[0m`);
        
    await dentist_new.save();
    console.log("Updated dentist:", dentist.firstname);
  } catch (error) {
    console.error("An error occurred:", error.response?.data || error.message);
  } finally {
    showMainMenu();
  }
}

// Doest violate the architecture - Retrieves clinic data from an external API (http://localhost:3001/clinics) and updates the dentist's information in the database based on user input
async function joinClinic(dentist) {
  try {
    const apiUrl = "http://localhost:3001/clinics";
    const response = await axios.get(apiUrl);
    const clinicsData = response.data;

    for (let i = 0; i < clinicsData.length; i++) {
      console.log(`${i + 1}. ${clinicsData[i].name}`);
    }

    let choice;
    do {
      choice = parseInt(await askQuestion("Choose the clinic you want to join:"));
    } while (choice < 1 || choice > clinicsData.length);

    const selectedClinic = clinicsData[choice - 1];
    console.log(`You selected clinic: ${selectedClinic.name}`);

    const isClinicAlreadyAdded = dentist.clinics.some((clinic) => clinic === selectedClinic._id);

    if (!isClinicAlreadyAdded) {
      const dentist_updated = await Dentist.findByIdAndUpdate(
        dentist._id,
        { $addToSet: { clinics: selectedClinic._id } },
        { new: true }
      );

      console.log(`Clinic with ID ${selectedClinic._id} added to dentist with ID ${dentist_updated._id}`);
    } else {
      console.log(`Clinic with ID ${selectedClinic._id} is already in the dentist's list`);
    }
  } catch (error) {
    console.error("An error occurred:", error.response?.data || error.message);
  } finally {
    showMainMenu();
  }
}

//Violates the architecture - Retrieves clinic data from the dentist's information and creates a new appointment in the database
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
      dateTime:dateTime,
      dentistId:dentistId,
      clinicId:clinicId,
      availability:true
    };
    const appointment = new Appointment(appointmentData)
    await appointment.save();
    console.log("Created appointment with id:", appointment._id);
  } catch (error) {
    console.error("An error occurred:", error.response?.data || error.message);
  } finally {
    showMainMenu();
  }
}

// Follows the architecture
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