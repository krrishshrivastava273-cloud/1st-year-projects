import { useState, useEffect } from "react";

import "./css/style.css";

import ChooseRole from "./pages/ChooseRole";
import Departments from "./pages/Departments";
import DepartmentDoctors from "./pages/DepartmentDoctors";
import Login from "./authorize/Login";
import Signup from "./authorize/Signup";
import ForgotPassword from "./authorize/ForgotPassword";
import OtpVerification from "./authorize/OtpVerification";
import ResetPassword from "./authorize/ResetPassword";
import DoctorHome from "./pages/DoctorHome";
import DoctorLogin from "./authorize/DoctorLogin";
import RescheduleAppointment from "./pages/RescheduleAppointment";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import Home from "./pages/Home";

function App() {
  // 1. Default to 'choose-role' to ensure the user always starts at the entry point
  const [page, setPage] = useState("choose-role");

  // 2. Allow specific URL entry for utility pages, but prioritize the flow
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/login") setPage("login");
    else if (path === "/signup") setPage("signup");
    else if (path === "/doctor-login") setPage("doctor-login");
    else if (path === "/forgot-password") setPage("forgot");
    else if (path === "/otp-verification") setPage("otp");
    else if (path === "/reset-password") setPage("reset");
  }, []);

  // 3. Security: Prevent unauthorized access to dashboards
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const protectedPages = ["patient-dashboard", "home", "doctor-dashboard", "doctor-home", "departments"];
    
    if (protectedPages.includes(page) && !role) {
      setPage("choose-role");
    }
  }, [page]);

  return (
    <div>
      {page === "choose-role" && <ChooseRole setPage={setPage} />}
      {page === "login" && <Login setPage={setPage} />}
      {page === "signup" && <Signup setPage={setPage} />}
      {page === "forgot" && <ForgotPassword setPage={setPage} />}
      {page === "otp" && <OtpVerification setPage={setPage} />}
      {page === "reset" && <ResetPassword setPage={setPage} />}
      {page === "home" && <Home setPage={setPage} />}
      {page === "doctor-login" && <DoctorLogin setPage={setPage} />}
      {page === "doctor-dashboard" && <DoctorDashboard setPage={setPage} />}
      {page === "doctor-home" && <DoctorHome setPage={setPage} />}
      {page === "patient-dashboard" && <PatientDashboard setPage={setPage} />}
      {page === "departments" && <Departments setPage={setPage} />}
      {page === "cardiology" && <DepartmentDoctors title="Cardiology" setPage={setPage} />}
      {page === "neurology" && <DepartmentDoctors title="Neurology" setPage={setPage} />}
      {page === "dental" && <DepartmentDoctors title="Dental" setPage={setPage} />}
      {page === "orthopedic" && <DepartmentDoctors title="Orthopedic" setPage={setPage} />}
      {page === "reschedule" && <RescheduleAppointment setPage={setPage} />}
    </div>
  );
}



export default App;