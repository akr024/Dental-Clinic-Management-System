# Patient API Service

This repository has the codebase for the Authentication Service, an important component in our healthcare system. The Authentication Service is responsible for user authentication, providing secure sign-up and login functionalities for both patients and dentists.

## Project Structure

<!-- The project is organized with the following main components: -->

## Project Structure

- **models:** Contains data models
- **routes:** Implements authentication for dentists and patients
- **test:** Includes tests for authentication
- **utils:** Includes utility functions
- **app.js:** Includes changes related to making JWT secret a required environment variable

## Setup

To set up this project locally, follow these steps:

1. Clone the repository to your local machine.
2. Install the required dependencies by running `npm install`.
3. Create a `.env` file in the root directory and ensure it contains the following variables:

```dotenv
MQTT_BROKER_URL
MQTT_BROKER_PORT
JWT_SECRET
MONGODB_URI