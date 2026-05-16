Docease – MERN Hospital Management System

A full-stack Hospital Management System developed using the MERN Stack that streamlines communication between doctors and patients through secure authentication, appointment management, medical report handling, OTP verification, PDF downloads, and real-time dashboard synchronization.

⸻

🚀 Features

Authentication & Security

* User Signup & Login
* Secure Forgot Password System
* Gmail OTP Verification
* Password Reset Functionality
* Environment Variable Security using .env

⸻

Patient Features

* Book Appointments
* Reschedule Appointments
* Cancel Appointments
* View Medical Reports
* Download Reports as PDF
* Dynamic Patient Dashboard

⸻

Doctor Features

* View Patient Appointments
* Receive Email Notifications for Appointments
* Manage Patients
* Add Medical Reports
* Dynamic Doctor Dashboard

⸻

Dashboard Features

* Sticky Navbar
* Smooth Section Navigation
* Responsive UI
* Real-Time Data Synchronization
* Dynamic MongoDB Data Fetching

⸻

Report System

* Doctor Medical Report Generation
* PDF Report Download using PDFKit
* MongoDB Report Storage

⸻

🛠️ Tech Stack

Frontend

* React.js
* JavaScript
* CSS

Backend

* Node.js
* Express.js

Database

* MongoDB
* MongoDB Compass

Authentication & Services

* Nodemailer
* Gmail SMTP
* dotenv

PDF Generation

* PDFKit

⸻

🏗️ Project Architecture

React Frontend
       ↓
REST APIs
       ↓
Express.js Backend
       ↓
Middleware Layer
       ↓
MongoDB Database
       ↓
Email & PDF Services

⸻

🔥 Main APIs Used

Authentication APIs

* POST /signup
* POST /login
* POST /forgot-password
* POST /verify-otp
* POST /reset-password

⸻

Appointment APIs

* POST /book-appointment
* GET /appointments/:email
* GET /doctor-appointments/:name
* PUT /reschedule-appointment/:id
* DELETE /appointments/:id

⸻

Medical Report APIs

* POST /add-report
* GET /reports/:email
* GET /download-report/:id

⸻

⚡ CRUD Operations

Operation	Usage
Create	Book appointments, add reports
Read	Fetch reports & appointments
Update	Reschedule appointments, reset password
Delete	Cancel appointments

⸻

📧 Advanced Features / USP

* Gmail OTP Authentication
* Doctor Email Notifications
* PDF Medical Report Downloads
* Real-Time Dashboard Updates
* Dynamic MongoDB Synchronization
* Role-Based Access Control
* Production-Oriented MERN Architecture
* Runtime-Safe React Rendering

⸻

🔐 Middleware Used

app.use(express.json())
app.use(cors())
dotenv.config()

⸻

📂 MongoDB Collections

* users
* doctors
* patients
* appointments
* reports

⸻

▶️ Run Locally

Clone Repository

git clone YOUR_GITHUB_REPO_LINK

⸻

Install Frontend Dependencies

npm install

⸻

Install Backend Dependencies

cd backend
npm install

⸻

Start Frontend

npm start

⸻

Start Backend

cd backend
node server.js

⸻

🌐 Environment Variables

Create a .env file inside backend folder:

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

⸻

📌 Future Enhancements

* JWT Authentication
* Video Consultation
* Online Payments
* AI-based Health Suggestions
* Cloud Deployment
* Admin Dashboard



👨‍💻 Developed By

Krrish Shrivastava

⸻

📜 License

This project is developed for educational and academic purposes.
