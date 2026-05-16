export default function DoctorHome({ setPage }) {

  return (

    <div className="home-container">
      <nav className="home-navbar">
        <h2>Docease Doctor</h2>
        <ul>
          <li onClick={() => setPage("doctor-dashboard")}>Dashboard</li>
          <li onClick={() => { localStorage.setItem("doctorTargetSection", "appointments"); setPage("doctor-dashboard"); }}>Appointments</li>
          <li onClick={() => { localStorage.setItem("doctorTargetSection", "patients"); setPage("doctor-dashboard"); }}>Patients</li>
          <li onClick={() => { localStorage.setItem("doctorTargetSection", "patients"); setPage("doctor-dashboard"); }}>Reports</li>
          <li onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            setPage("choose-role");
          }} style={{color: '#ef4444', fontWeight: 'bold'}}>Logout</li>
        </ul>

      </nav>

      <div className="hero-section">
        <div className="hero-left">
          <h1>Manage Your Patients Efficiently</h1>
          <p>Access appointments, reports and patient records easily.</p>
          <button
            className="hero-btn"
            onClick={() => setPage("doctor-dashboard")}
          >
            Open Dashboard
          </button>
        </div>
        <div className="hero-right">
          <img
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d"
            alt="doctor"
          />
        </div>
      </div>
    </div>
  );
}