# Group-09-Project


## Project overview
![Architecture diagram](/Users/maisjobsen/Downloads/MS1.jpg)

**Tiers & components**
- GUI Client: Web user interface for patients to make/view bookings.
- Middleware: Core application logic, with
    - Patient API: Processes patient requests.
    - Booking service: Manages booking operations and interacts with a main database.
    - Dentist API: Interface for dentist interactions.
    - MQTT Broker: Messaging intermediary for services.
    - Statistics Service: Analyses data, stored in its own database.
    - Log Service: Records system activities.
    - Notification Service: Sends alerts, notifications and updates.
- Client: Interface for dentists to view/manage appointments.

**Relationships**
- Patients use the GUI Client to interact with the Middleware via the Patient API.
- The Middleware's Booking Service processes requests and accesses the main Database.
- Dentists access their information through the Client, interfacing with the Dentist API.
- The MQTT Broker handles message exchanges between different services.
- Statistics, Log, and Notification Services provide data analytics, system activity tracking, and alerts, respectively. The Statistics Service has its own database.

**Architectures used**
- Layered architecture: System divided into layers: GUI Client and Client (presentation), Middleware (logic), and Databases (data storage).
- Client-server architecture: Distinct clients (e.g., GUI Client) request services from servers (e.g., Web backend).
- Publish-subscribe architecture: Components publish messages to topics; others subscribe and receive these messages via MQTT Broker.
