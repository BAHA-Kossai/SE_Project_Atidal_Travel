# SE_Project_Atidal_Travel


## Overview

**Atidal Travel** is a full-stack web platform developed to modernize travel agency operations and simplify the booking experience for customers in Algeria. The system centralizes travel packages, destinations, and reservations into a single digital platform, eliminating the need for in-person agency visits.

The platform provides **separate user and administrative dashboards** to manage bookings, branches, employees, and travel content efficiently. It supports multilingual access and scalable backend services suitable for real-world agency workflows.

---

## Key Features

### 1. Online Booking System

* Book travel destinations or agency-organized packages (e.g., Umrah and group trips)
* Guest and registered user booking support
* Booking workflow management:

  * Submission
  * Admin review
  * Branch assignment
  * Acceptance or rejection
* Booking status tracking:

  * Pending
  * Confirmed
  * Cancelled
  * Completed
  * Rejected
* Booking modification and cancellation for authenticated users

### 2. Administrative Dashboard

* Role-based access control:

  * Super Admin
  * Branch Manager
  * Employee
* Centralized booking management
* Branch management (create, update, delete)
* Employee and guide management
* Analytics and statistics dashboard
* Content and package management

### 3. Travel Content Management

* Display agency travel packages
* Destination suggestions for travelers
* User rating and review system


### 4. Responsive User Interface

* Mobile-first responsive design
* Modern and intuitive navigation
* Cross-device compatibility:

  * Mobile
  * Tablet
  * Desktop

---

## Technologies Used

**Frontend**

* React
* JavaScript
* HTML / CSS

**Backend**

* Node.js
* Express.js
* REST API

**Database & Authentication**

* Supabase (PostgreSQL)
* Supabase Authentication

**Other Tools**

* Git & GitHub
* Email verification (SMTP)
* Session-based authentication

---

## System Architecture

Client (React Frontend)
↓
REST API (Express.js Backend)
↓
Supabase Database (PostgreSQL)

The backend exposes RESTful endpoints that handle authentication, booking management, and administrative operations. The frontend communicates with the backend through HTTP/HTTPS requests.

---

## User Roles

### Traveler

* Browse destinations and packages
* Make bookings
* Track booking status
* Cancel or modify reservations
* Submit ratings and reviews

### Super Admin

* Manage all branches
* View and process all bookings
* Manage employees and guides
* Monitor system analytics

### Branch Manager / Employee

* Handle assigned bookings
* Manage branch-specific operations

---

## Performance and Security

### Performance

* Page load time under 2 seconds
* Booking response time under 3 seconds
* Designed to support concurrent users during peak seasons

### Security

* Secure authentication and authorization
* Input validation and SQL injection protection
* Session management with timeout
* Encrypted communication using HTTPS
* Backup and recovery procedures

---

## Future Enhancements

* Online payment integration (e.g., Dahabia)
* Loyalty and rewards system
* Mobile application (iOS / Android)
* Advanced analytics dashboard
* Appointment scheduling system for agency visits

---

## Installation (Typical Setup)

```bash
git clone <repository-url>
cd SE_Project_Atidal_Travel
npm install
npm run dev
```

---

## Project Status

The project is approximately 80% complete and currently functional for core features such as booking management, administrative dashboards, and user interactions. Some issues and enhancements remain under development, including bug fixes, performance improvements, and additional feature refinement.

The system is actively maintained and being improved as part of continued development and learning.

