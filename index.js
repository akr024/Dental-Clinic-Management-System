const readline = require('readline');
const axios = require('axios');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

async function registerDentist() {
  console.clear();
  const username = await askQuestion('Enter username: ');
  const personnummer = await askQuestion('Enter personnummer: ');
  const firstname = await askQuestion('Enter first name: ');
  const lastname = await askQuestion('Enter last name: ');
  const email = await askQuestion('Enter email: ');
  const password = await askQuestion('Enter password: ');

  const dentistData = {
    username,
    personnummer,
    firstname,
    lastname,
    email,
    password
  };

  const apiUrl = 'http://localhost:8080/dentists'; 

  try {
    const response = await axios.post(apiUrl, dentistData);
    console.log('Registered successfully:', response.data);
  } catch (error) {
    console.error('An error occurred:', error.response?.data || error.message);
  }

  showMainMenu();
}

function viewAppointments() {
  console.clear();
  // TODO
  console.log('View appointments functionality is not implemented yet.');
  showMainMenu();
}

function retrieveBookedAppointments() {
  console.clear();
  // TODO
  console.log('Retrieve booked appointments functionality is not implemented yet.');
  showMainMenu();
}

function showMainMenu() {
  console.clear();
  console.log('Welcome to the Dentist UI');
  console.log('1. Register as a Dentist');
  console.log('2. View Appointments');
  console.log('3. Retrieve Booked Appointments');
  console.log('4. Exit');
  rl.question('Enter your choice: ', async (choice) => {
    switch (choice.trim()) {
      case '1':
        await registerDentist();
        break;
      case '2':
        viewAppointments();
        break;
      case '3':
        retrieveBookedAppointments();
        break;
      case '4':
        rl.close();
        break;
      default:
        console.log('Invalid choice, please try again.');
        showMainMenu();
    }
  });
}

rl.on('close', () => {
  console.log('Exiting the Dentist UI.');
  process.exit(0);
});

showMainMenu();
