# Dentist UI Project

This repository focuses on the development of the Dentist UI in healthcare system. The Dentist UI provides dentists with an interface to manage appointments, check time slot availability, and join clinics and register dentists as well as clinics.

## Project Structure

- **index.js:** The main entry point for the Dentist UI application.
- **models:** Contains data models for the Dentist UI

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
