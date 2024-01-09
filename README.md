# Group-09-Project-Notification-Service

# Introduction

This is the notification service, which is responsible for notifying the users (patients and dentists) upon appointment bookings and cancellations. The notifications are sent to the users email addresses, which is fetched from the user database. This means that this segment of the architecture utilises a service oriented + microservices architecture approach (as it has its own notification database used to store notifications once they have been created). The notifications are sent through the use of nodemailer, which is a module used to configure code to send emails. Further, some basic tests have been set up in the test folder to demonstrate that the emails are appropriately fetched, a notification is formed and sent to the user. The testing has been setup using Jest library, which mocks nodemailer for the purpose of testing.

# Usage

Once the library has been cloned into the local environment, these are the steps you should follow:
1. Run 'npm i' to download all the dependencies mentioned in package.json.
2. Add a .env file at the root of the project and add the following information:
 - MQTT_BROKER_URL - This is the broker URL that will be used for connecting to the MQTT broker.
 - MQTT_BROKER_PORT - This is the port that the MQTT broker will be accessed through.
 - MONGO_URL_EMAIL - This is the mongo database connection URL to connect to the user database, in order to fetch the emails of the users (patients + dentists).
 - MONGO_URL_NOTIFICATION - This is the mongo database connection URL to connect to the notification database, in order to save notifications once they have been created and sent to the users.
 - EMAIL - This is the email address which will be used to send the notifications from. It should simply be a string of the email you have set up your access token on.
 - ACCESS_TOKEN - This is the access token. When you go to manage your google account for the email you intend to use, search for 'App Passwords', set up an app password and copy-paste the password in a string.

 Note: Make sure to only provide the access token and the email as a simple string and not use any symbols next to them such as ';' as the code will take as part of the email and errors regarding having an incorrect email would occur.

 Once all the environment variables have been appropriately added and configured, you can simply run the service by typing: 'npm run dev'.

 This should then console log that the user database, the MQTT broker, and the notification datbase have been connected.

 Afterwards, the rest of the services are configured as such to publish to the notification service subscription topics for the notifications to be sent upon the execution of an event, such as cancelling an appointment or making a booking.

 # Testing

 Although only some basic testing has been added for this service due to the limitations of not being able to test by accessing the recipient's emails, but the testing can be run by typing the following command in the terminal: 'npm test'.

 # Contributions

 Primarily, Abhimanyu Kumar has been responsible for this service and has worked on it majorly. Support from Linh Pham and Piotr Ostrowski has also been given in configuring the topic names to be published to.

