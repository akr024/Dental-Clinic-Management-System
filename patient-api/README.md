# Patient API Repository

This repository contains the codebase for the Patient API service, one of the components in our healthcare system.

## Project Structure

<!-- The project structure follows: -->

- **Routes:** Set up for various API endpoints.
- **Models:** Definitions for the data models used in the application.
- **Middleware:** Authentication and MQTT functionality.
- **Tests:** Integration tests for the API.

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
