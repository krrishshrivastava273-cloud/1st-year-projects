// 1. Import necessary libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
require('dotenv').config();


// 2. Initialize the Express application
const app = express();

// 3. Setup middleware to allow cross-origin requests and parse JSON data
app.use(cors());
app.use(express.json());

// 4. Connect to MongoDB database
// We use the local connection string as requested
mongoose.connect('mongodb://127.0.0.1:27017/docease')
  .then(() => {
    // This console log confirms the database is successfully connected
    console.log("MongoDB Connection Successful!");
    seedDoctors(); // Call safe one-time seed process
  })
  .catch((error) => {
    // If there is an error connecting, we log it
    console.log("Error connecting to MongoDB:", error);
  });

// 5. Define MongoDB Models using Mongoose

// --- PATIENT MODEL ---
// This schema defines what data a Patient document will hold
const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true }
});
// Create the actual model from the schema
const Patient = mongoose.model('Patient', patientSchema);

// --- DOCTOR MODEL ---
// This schema defines what data a Doctor document will hold
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  department: { type: String },
  reviews: { type: Number, default: 0 },
  image: { type: String }
});
// Create the actual model from the schema
const Doctor = mongoose.model('Doctor', doctorSchema);

// --- USER MODEL (Consolidated collection as requested) ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, required: true }
}, { collection: 'users' }); // Explicitly use the 'users' collection
const User = mongoose.model('User', userSchema);

// --- SEED DOCTORS (Safe One-Time Seed) ---
const seedDoctors = async () => {
  try {
    const doctorsCount = await Doctor.countDocuments();
    if (doctorsCount === 0) {
      console.log("Seeding doctors into MongoDB...");
      const doctorsList = [
        { name: "Dr. Michael Lee", email: "michael.lee@docease.com", password: "password123", department: "Cardiology", reviews: 150, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250&h=250" },
        { name: "Dr. Robert Smith", email: "robert.smith@docease.com", password: "password123", department: "Cardiology", reviews: 200, image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=250&h=250" },
        { name: "Dr. Sarah Johnson", email: "sarah.johnson@docease.com", password: "password123", department: "Neurology", reviews: 320, image: "https://images.unsplash.com/photo-1594824436951-7f12bc414286?auto=format&fit=crop&q=80&w=250&h=250" },
        { name: "Dr. Emily Davis", email: "emily.davis@docease.com", password: "password123", department: "Neurology", reviews: 180, image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=250&h=250" },
        { name: "Dr. Kevin Brown", email: "kevin.brown@docease.com", password: "password123", department: "Dental", reviews: 210, image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=250&h=250" },
        { name: "Dr. Sophia Wilson", email: "sophia.wilson@docease.com", password: "password123", department: "Dental", reviews: 290, image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=250&h=250" },
        { name: "Dr. James Walker", email: "james.walker@docease.com", password: "password123", department: "Orthopedic", reviews: 190, image: "https://images.unsplash.com/photo-1527613426496-e2d7f8728ed2?auto=format&fit=crop&q=80&w=250&h=250" },
        { name: "Dr. Daniel Moore", email: "daniel.moore@docease.com", password: "password123", department: "Orthopedic", reviews: 230, image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=250&h=250" }
      ];
      
      for (let doc of doctorsList) {
        const existing = await Doctor.findOne({ email: doc.email });
        if (!existing) {
          await new Doctor(doc).save();
        }
      }
      console.log("Doctors seeded successfully.");
    } else {
      console.log("Doctors already exist in DB. Skipping seed.");
    }
  } catch (err) {
    console.error("Error seeding doctors:", err);
  }
};


// 6. Define API Routes

// --- PATIENT ROUTES ---

// Route for Patient Signup
app.post('/patient/signup', async (req, res) => {
  try {
    // Get patient details from the request body
    const { name, email, phone, password } = req.body;

    // Check if a patient with this email already exists
    const existingPatient = await Patient.findOne({ email: email });
    if (existingPatient) {
      return res.status(400).json({ message: "Patient email already exists!" });
    }

    // Create a new patient (Plain password is saved for simplicity)
    const newPatient = new Patient({
      name: name,
      email: email,
      phone: phone,
      password: password
    });

    // Save the new patient to the database
    await newPatient.save();

    // Send a success response back to the frontend
    res.status(200).json({ message: "Patient registered successfully!", user: newPatient });
  } catch (error) {
    // Send an error response if something goes wrong
    res.status(500).json({ message: "An error occurred during patient signup." });
  }
});

// Route for Patient Login
app.post('/patient/login', async (req, res) => {
  try {
    // Get login details from the request body
    const { email, password } = req.body;

    // Find the patient by email
    const patient = await Patient.findOne({ email: email });

    // Check if patient exists and if the plain text password matches
    if (!patient || patient.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Send a success response back to the frontend
    res.status(200).json({ message: "Patient login successful!", user: patient });
  } catch (error) {
    // Send an error response if something goes wrong
    res.status(500).json({ message: "An error occurred during patient login." });
  }
});

app.put('/update-patient/:email', async (req, res) => {
  try {
    const updatedPatient = await Patient.findOneAndUpdate({ email: req.params.email }, req.body, { new: true });
    console.log(`[UPDATE SUCCESS] Patient profile updated: ${req.params.email}`);
    res.status(200).json({ message: "Profile updated successfully!", user: updatedPatient });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
});


// --- DOCTOR ROUTES ---

// Route to get all doctors
app.get('/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

// Route for Doctor Signup
app.post('/doctor/signup', async (req, res) => {
  try {
    // Get doctor details from the request body
    const { name, email, phone, password } = req.body;

    // Check if a doctor with this email already exists
    const existingDoctor = await Doctor.findOne({ email: email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor email already exists!" });
    }

    // Create a new doctor (Plain password is saved for simplicity)
    const newDoctor = new Doctor({
      name: name,
      email: email,
      phone: phone,
      password: password
    });

    // Save the new doctor to the database
    await newDoctor.save();

    // Send a success response back to the frontend
    res.status(200).json({ message: "Doctor registered successfully!", user: newDoctor });
  } catch (error) {
    // Send an error response if something goes wrong
    res.status(500).json({ message: "An error occurred during doctor signup." });
  }
});

// Route for Doctor Login
app.post('/doctor/login', async (req, res) => {
  try {
    // Get login details from the request body
    const { email, password } = req.body;

    // Find the doctor by email
    const doctor = await Doctor.findOne({ email: email });

    // Check if doctor exists and if the plain text password matches
    if (!doctor || doctor.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Send a success response back to the frontend
    res.status(200).json({ message: "Doctor login successful!", user: doctor });
  } catch (error) {
    // Send an error response if something goes wrong
    res.status(500).json({ message: "An error occurred during doctor login." });
  }
});

// --- FORGOT PASSWORD ROUTES ---

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify SMTP configuration on startup
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("CRITICAL ERROR: Gmail credentials (EMAIL_USER, EMAIL_PASS) are missing in .env file.");
} else {
  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP Configuration Error:", error);
    } else {
      console.log("Gmail SMTP is ready to send OTPs.");
    }
  });
}

// Temporary in-memory store for OTPs
const otpStore = {};

app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ message: "Server email configuration is missing." });
    }

    // Normalize email for case-insensitive search (trim and lowercase)
    const searchEmail = email.trim().toLowerCase();

    // Check if user exists across all three potential collections
    const user = await User.findOne({ email: { $regex: new RegExp(`^${searchEmail}$`, 'i') } });
    const patient = await Patient.findOne({ email: { $regex: new RegExp(`^${searchEmail}$`, 'i') } });
    const doctor = await Doctor.findOne({ email: { $regex: new RegExp(`^${searchEmail}$`, 'i') } });

    if (!user && !patient && !doctor) {
      console.log(`[FORGOT PASSWORD EMAIL NOT FOUND] for: ${email}`);
      return res.status(404).json({ message: "Email not found" });
    }

    console.log(`[FORGOT PASSWORD EMAIL FOUND] Found account for: ${email}`);


    // Generate a simple 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[OTP GENERATED] for ${searchEmail}: ${otp}`);
    
    // Store the OTP with expiration (5 minutes = 300000 ms) using normalized email as key
    otpStore[searchEmail] = {
      otp: otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    };


    // Send email using nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Docease - Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`[EMAIL FAILED] for ${email}:`, error);
        return res.status(500).json({ message: "Failed to send OTP email. Please check server logs." });
      } else {
        console.log(`[OTP SENT] delivered to ${email}`);
        res.status(200).json({ message: "OTP sent successfully to your email!" });
      }
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "An error occurred." });
  }
});


// Route to verify OTP
app.post('/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    const searchEmail = email.trim().toLowerCase();
    
    const storedData = otpStore[searchEmail];

    if (!storedData) {
      return res.status(400).json({ message: "OTP not requested or expired." });
    }

    if (Date.now() > storedData.expiresAt) {
      delete otpStore[searchEmail];
      return res.status(400).json({ message: "OTP has expired." });
    }


    if (storedData.otp === otp) {
      // Keep OTP data to allow reset-password to proceed, but optionally mark it verified
      storedData.verified = true;
      res.status(200).json({ message: "OTP Verified" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred." });
  }
});

// --- APPOINTMENT & PRESCRIPTION MODELS ---
const appointmentSchema = new mongoose.Schema({
  patientEmail: { type: String, required: true },
  doctorName: { type: String, required: true },
  department: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true }
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

const prescriptionSchema = new mongoose.Schema({
  patientEmail: { type: String, required: true },
  doctorName: { type: String, required: true },
  medicine: { type: String, required: true },
  dosage: { type: String, required: true },
  duration: { type: String },
  instructions: { type: String }
});
const Prescription = mongoose.model('Prescription', prescriptionSchema);

const reportSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  doctorName: { type: String, required: true },
  department: { type: String, required: true },
  diagnosis: { type: String, required: true },
  prescription: { type: String, required: true },
  date: { type: String, required: true }
});
const Report = mongoose.model('Report', reportSchema);

const seedReports = async () => {
  try {
    const reportsCount = await Report.countDocuments();
    if (reportsCount === 0) {
      console.log("Seeding reports into MongoDB...");
      const sampleReports = [
        {
          patientName: "Sundar Lal",
          patientEmail: "sundarlal374@gmail.com",
          doctorName: "Dr. Michael Lee",
          department: "Cardiology",
          diagnosis: "Mild Hypertension",
          prescription: "Lisinopril 10mg daily",
          date: "20 May 2026"
        },
        {
          patientName: "Sundar Lal",
          patientEmail: "sundarlal374@gmail.com",
          doctorName: "Dr. Sarah Johnson",
          department: "Neurology",
          diagnosis: "Migraine",
          prescription: "Sumatriptan 50mg as needed",
          date: "15 May 2026"
        }
      ];
      for (let rep of sampleReports) {
        await new Report(rep).save();
      }
      console.log("Reports seeded successfully.");
    }
  } catch (err) {
    console.error("Error seeding reports:", err);
  }
};
seedReports();

// --- DASHBOARD ROUTES ---

app.post('/book-appointment', async (req, res) => {
  try {
    const { patientEmail, doctorName, department, date, time } = req.body;
    
    // 1. Save appointment in MongoDB
    const newAppt = new Appointment(req.body);
    await newAppt.save();
    console.log(`[APPOINTMENT BOOKED] Patient: ${patientEmail}, Doctor: ${doctorName}`);

    // 2. Fetch patient details
    const patient = await Patient.findOne({ email: patientEmail });
    const patientName = patient ? patient.name : "Patient";

    // 3. Fetch doctor details (to get email)
    const doctor = await Doctor.findOne({ name: doctorName });

    if (doctor && doctor.email) {
      // 4. Send Gmail notification to the selected doctor
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: doctor.email,
        subject: 'New Appointment Booking - Docease',
        text: `Dear ${doctorName},

You have received a new appointment booking.

Booking Details:
- Patient Name: ${patientName}
- Patient Email: ${patientEmail}
- Department: ${department}
- Date: ${date}
- Time: ${time}

Please check your dashboard for more details.

Best regards,
Docease Team`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`[EMAIL FAILED] to doctor ${doctor.email}:`, error);
        } else {
          console.log(`[DOCTOR EMAIL SENT] to ${doctor.email}`);
        }
      });
    } else {
      console.log(`[DOCTOR EMAIL SKIPPED] No email found for doctor: ${doctorName}`);
    }

    res.status(200).json({ message: "Appointment booked successfully!" });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Error booking appointment" });
  }
});


app.get('/appointments/:email', async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientEmail: req.params.email });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments" });
  }
});

app.post('/reschedule-appointment', async (req, res) => {
  try {
    const { appointmentId, newDate, newTime } = req.body;
    
    // 1. Fetch current appointment details before update
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const oldDate = appointment.date;
    const oldTime = appointment.time;
    const patientEmail = appointment.patientEmail;
    const doctorName = appointment.doctorName;

    // 2. Update MongoDB appointment data
    appointment.date = newDate;
    appointment.time = newTime;
    await appointment.save();
    console.log(`[APPOINTMENT UPDATED] ID: ${appointmentId}`);

    // 3. Fetch patient and doctor details for the email
    const patient = await Patient.findOne({ email: patientEmail });
    const patientName = patient ? patient.name : "Patient";
    const doctor = await Doctor.findOne({ name: doctorName });

    if (doctor && doctor.email) {
      // 4. Send Gmail notification to the assigned doctor
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: doctor.email,
        subject: 'Appointment Rescheduled Notification',
        text: `Dear ${doctor.name},

The appointment for patient ${patientName} has been rescheduled.

Appointment Details:
- Patient Name: ${patientName}
- Old Date/Time: ${oldDate} at ${oldTime}
- New Date/Time: ${newDate} at ${newTime}

Please update your schedule accordingly.

Best regards,
Docease Team`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`[EMAIL FAILED] to doctor ${doctor.email}:`, error);
        } else {
          console.log(`[DOCTOR EMAIL SENT] to ${doctor.email}`);
        }
      });
    } else {
      console.log(`[DOCTOR EMAIL SKIPPED] No email found for doctor: ${doctorName}`);
    }

    res.status(200).json({ message: "Appointment rescheduled successfully!" });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    res.status(500).json({ message: "Error rescheduling appointment" });
  }
});

app.delete('/cancel-appointment/:id', async (req, res) => {
  try {
    const deletedAppt = await Appointment.findByIdAndDelete(req.params.id);
    if (!deletedAppt) return res.status(404).json({ message: "Appointment not found" });
    console.log(`[DELETE SUCCESS] Appointment cancelled: ${req.params.id}`);
    res.status(200).json({ message: "Appointment cancelled successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling appointment" });
  }
});



app.post('/add-prescription', async (req, res) => {
  try {
    const newPrescription = new Prescription(req.body);
    await newPrescription.save();
    res.status(200).json({ message: "Prescription added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding prescription" });
  }
});

app.get('/prescriptions/:email', async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientEmail: req.params.email });
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching prescriptions" });
  }
});

app.get('/reports/:email', async (req, res) => {
  try {
    const reports = await Report.find({ patientEmail: req.params.email });
    console.log(`[READ SUCCESS] Reports fetched for ${req.params.email}`);
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports" });
  }
});

app.post('/add-report', async (req, res) => {
  try {
    const newReport = new Report(req.body);
    await newReport.save();
    console.log(`[CREATE SUCCESS] New report added for ${req.body.patientEmail}`);
    res.status(200).json({ message: "Report added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding report" });
  }
});

app.put('/update-report/:id', async (req, res) => {
  try {
    const updatedReport = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log(`[UPDATE SUCCESS] Report updated: ${req.params.id}`);
    res.status(200).json({ message: "Report updated successfully!", report: updatedReport });
  } catch (error) {
    res.status(500).json({ message: "Error updating report" });
  }
});

app.delete('/delete-report/:id', async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    console.log(`[DELETE SUCCESS] Report deleted: ${req.params.id}`);
    res.status(200).json({ message: "Report deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting report" });
  }
});


app.get('/download-report/:id', async (req, res) => {
  try {
    const reportId = req.params.id;
    console.log(`[REPORT DOWNLOAD REQUEST] ID: ${reportId}`);

    const report = await Report.findById(reportId);
    if (!report) {
      console.error(`[REPORT NOT FOUND] ID: ${reportId}`);
      return res.status(404).json({ message: "Report not found" });
    }

    const doc = new PDFDocument();
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Docease_Report_${report.date.replace(/ /g, "_")}.pdf`);

    // Stream the PDF to the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(25).text('Docease Medical Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${report.date}`);
    doc.text(`Patient Name: ${report.patientName}`);
    doc.text(`Email: ${report.patientEmail}`);
    doc.text(`Doctor: ${report.doctorName} (${report.department})`);
    doc.moveDown();
    doc.fontSize(16).text('Diagnosis:', { underline: true });
    doc.fontSize(12).text(report.diagnosis);
    doc.moveDown();
    doc.fontSize(16).text('Prescription:', { underline: true });
    doc.fontSize(12).text(report.prescription);
    doc.moveDown(2);
    doc.fontSize(10).fillColor('grey').text('This is an automatically generated report by Docease.', { align: 'center' });

    doc.end();
    console.log(`[REPORT DOWNLOAD SUCCESS] ID: ${reportId}`);
  } catch (error) {
    console.error("Error generating report PDF:", error);
    res.status(500).json({ message: "Error generating report PDF" });
  }
});

app.get('/doctor-appointments/:name', async (req, res) => {
  try {
    const doctorName = req.params.name;
    const appointments = await Appointment.find({ doctorName: doctorName });
    
    // Enrich appointments with patient names
    const enrichedAppointments = await Promise.all(appointments.map(async (appt) => {
      const patient = await Patient.findOne({ email: appt.patientEmail });
      return {
        ...appt._doc,
        patientName: patient ? patient.name : "Unknown Patient"
      };
    }));

    console.log(`[DOCTOR DASHBOARD UPDATED] for doctor: ${doctorName}`);
    res.status(200).json(enrichedAppointments);
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({ message: "Error fetching doctor appointments" });
  }
});



// Route to reset password
app.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    console.log(`[PASSWORD RESET REQUEST] for: ${email}`);
    
    // Normalize email for searching
    const searchEmail = email.trim().toLowerCase();
    const storedData = otpStore[searchEmail];

    // Ensure OTP was verified recently
    if (!storedData || !storedData.verified) {
      console.log(`[PASSWORD UPDATE FAILED] Session expired or not verified for: ${email}`);
      return res.status(400).json({ message: "Session expired or OTP not verified. Please try again." });
    }

    // Update in all potential collections using updateOne()
    const userUpdate = await User.updateOne(
      { email: { $regex: new RegExp(`^${searchEmail}$`, 'i') } },
      { $set: { password: newPassword } }
    );
    
    const patientUpdate = await Patient.updateOne(
      { email: { $regex: new RegExp(`^${searchEmail}$`, 'i') } },
      { $set: { password: newPassword } }
    );
    
    const doctorUpdate = await Doctor.updateOne(
      { email: { $regex: new RegExp(`^${searchEmail}$`, 'i') } },
      { $set: { password: newPassword } }
    );

    if (userUpdate.matchedCount === 0 && patientUpdate.matchedCount === 0 && doctorUpdate.matchedCount === 0) {
      console.log(`[PASSWORD UPDATE FAILED] User not found: ${email}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Success
    console.log(`[PASSWORD UPDATED SUCCESS] for: ${email}`);
    
    // Cleanup OTP store
    delete otpStore[searchEmail];

    res.status(200).json({ message: "Password updated successfully!" });

  } catch (error) {
    console.error("[PASSWORD UPDATE FAILED] Error:", error);
    res.status(500).json({ message: "An error occurred during password reset." });
  }
});
// 7. Start the server

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running smoothly on port ${PORT}`);
});
