const readline = require('readline');
const axios = require('axios');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function showMainMenu() {
  console.clear();
  console.log('Welcome to the Dentist UI');
  console.log('1. Register as a Dentist');
  console.log('2. View Appointments');
  console.log('3. Retrieve Booked Appointments');
  console.log('4. Exit');
  rl.question('Enter your choice: ', (choice) => {
    switch (choice.trim()) {
      case '1':
        // TODO: implement registerDentist()
        console.log('Registering as a dentist...');
        break;
      case '2':
        // TODO: implement viewAppointments()
        console.log('Viewing appointments...');
        break;
      case '3':
        // TODO: implement retrieveBookedAppointments()
        console.log('Retrieving booked appointments...');
        break;
      case '4':
        console.log('Exiting...');
        rl.close();
        break;
      default:
        console.log('Invalid choice, please try again.');
        showMainMenu();
        break;
    }
  });
}

rl.on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});

showMainMenu();
