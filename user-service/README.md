# User Service

This repository contains the codebase for the User Service, an important component of our healthcare system. The User Service is responsible for managing user-related functionalities, including user registration, and profile management.

## Project Structure

- **Controller:** Handles the logic for processing user requests and managing the flow of data.
- **Model:** Defines the data models used in the application.
- **Service:** Implements the business logic for user-related functionalities.
- **Test:** Contains comprehensive tests.
- **App.js:** The main entry point for the application.
- **Config.js:** Manages configuration settings for the User Service.

## Setup
1. Clone the repository to your local machine.
2. Install the required dependencies by running `npm install`.
3. Create a `.env` file in the root directory and ensure it contains the following variables:

```dotenv
MQTT_BROKER_URL
MQTT_BROKER_PORT
JWT_SECRET
MONGODB_URI