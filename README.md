# Dental Clinic Management System

A **microservices-based distributed system** designed to streamline dental clinic operations by enabling appointment management, patient booking, and real-time notifications using a **publish–subscribe architecture (custom MQTT)**.

This project demonstrates the design and implementation of a **scalable, event-driven system** suitable for real-world healthcare workflows.

---

## Overview

The Dental Clinic Management System allows:

- **Patients** to book, reschedule, or cancel dental appointments  
- **Dentists/clinics** to manage appointments and patient schedules  
- **Real-time notifications** to be delivered across services using MQTT  

The system follows a **microservices architecture**, with loosely coupled services communicating via a **message broker**, making it scalable and fault-tolerant.

---

## System Architecture

- Microservices-based architecture  
- Event-driven communication using MQTT (Publish–Subscribe model)  
- Unified monorepo containing all backend services and frontend components  
- Decoupled services for better scalability and maintainability  

### High-level Flow
1. Patient books or cancels an appointment  
2. Appointment service publishes an event  
3. Notification service subscribes and processes the event  
4. Users receive real-time updates  

---

## Key Features

### Real-Time Notifications
- Notification service built using MQTT’s pub/sub architecture  
- Instant updates for appointment confirmations, cancellations, and reminders  
- Asynchronous communication across distributed services  

### Appointment Management
- Book, update, and cancel appointments  
- Dentist-side appointment overview  
- Patient-side appointment tracking  

### Responsive Frontend
- Displays appointment and notification data in real time  
- Built with responsive UI components  
- Designed for both patients and clinic staff  

---

## Build & Run Instructions

> **Important:**  
> This repository uses a **monorepo structure**.

**Build, run, and configuration instructions are located inside each individual subfolder**, including:
- Each service under `/`
- The frontend GUI is also a service: `/paitient-gui`

Please refer to the respective `README.md` files within those directories for service-specific setup steps.
