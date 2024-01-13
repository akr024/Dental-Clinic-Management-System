# Dentist API Main

This repository serves as the main codebase for the Dentist API, an important component within our healthcare system. The Dentist API is for managing dentist-related data and interactions. It provides essential functionalities for clinics, appointments, and user profiles specific to dentists.

## Project Structure

- **Routes:** Configuration of various API endpoints, defining the routes for clinics and other dentist-related functionalities.
- **User.js:** Implementation of routes and logic specific to dentist user profiles, including features such as clinics retrieval.
- **Config.js:** Management of configuration settings for the Dentist API.
- **Index.js:** The main entry point for the Dentist API, orchestrating the initialization and setup procedures.

## Setup
1. Clone the repository to your local machine.
2. Install the required dependencies by running `npm install`.
3. Create a `.env` file in the root directory and ensure it contains the following variables:

```dotenv
MQTT_BROKER_URL
MQTT_BROKER_PORT
JWT_SECRET
MONGODB_URI
