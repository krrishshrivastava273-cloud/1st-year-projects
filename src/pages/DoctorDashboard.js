import { useState, useEffect, useRef } from "react";


export default function DoctorDashboard({ setPage }) {
  const [activeCard, setActiveCard] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPrescription, setNewPrescription] = useState({
    patientEmail: "",
    medicine: "",
    dosage: "",
    duration: "",
    instructions: ""
  });
  const expandedViewRef = useRef(null);


  const doctorName = localStorage.getItem("doctorName") || "Dr. Michael Lee";

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:5001/doctor-appointments/${doctorName}`);
        if (response.ok) {
          const data = await response.json();
          setAppointments(Array.isArray(data) ? data : []);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.error("Error fetching doctor appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorName]);

  useEffect(() => {
    const target = localStorage.getItem("doctorTargetSection");
    if (target) {
      setActiveCard(target);
      localStorage.removeItem("doctorTargetSection");
    }
  }, []);

  useEffect(() => {

    if (activeCard) {
      expandedViewRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeCard]);


  const handleAddPrescription = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/add-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPrescription,
          doctorName: doctorName
        })
      });
      const data = await response.json();
      alert(typeof data?.message === 'string' ? data.message : "Prescription added successfully");
      if (response.ok) {
        setNewPrescription({ patientEmail: "", medicine: "", dosage: "", duration: "", instructions: "" });
      }
    } catch(err) {
      alert("Failed to add prescription");
    }
  };

  const patientsList = [
    { name: "John Doe", age: 45, disease: "Hypertension", date: "20 May 2026" },
    { name: "Jane Smith", age: 32, disease: "Migraine", date: "21 May 2026" },
    { name: "Michael Johnson", age: 58, disease: "Diabetes Type 2", date: "22 May 2026" },
    { name: "Emily Davis", age: 29, disease: "Asthma", date: "23 May 2026" },
    { name: "William Brown", age: 41, disease: "Back Pain", date: "24 May 2026" }
  ];

  const prescriptionsList = [
    { name: "John Doe", medicine: "Lisinopril", dosage: "10mg daily", date: "10 May 2026" },
    { name: "Michael Johnson", medicine: "Metformin", dosage: "500mg twice daily", date: "12 May 2026" },
    { name: "Emily Davis", medicine: "Albuterol", dosage: "2 puffs every 4 hours PRN", date: "13 May 2026" }
  ];

  const notificationsList = (Array.isArray(appointments) ? appointments : []).slice(0, 5).map(appt => ({
    text: `New appointment booked by ${appt?.patientName || "Unknown"}`,
    time: appt?.date || "N/A",
    unread: true
  }));

  const handleCancelAppointment = async (appointmentId) => {
    if(!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const response = await fetch(`http://localhost:5001/cancel-appointment/${appointmentId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      alert(typeof data?.message === 'string' ? data.message : "Appointment cancelled");
      if(response.ok) {
        setAppointments(appointments.filter(a => a._id !== appointmentId));
      }
    } catch(err) {
      alert("Error cancelling appointment");
    }
  };

  const [newReport, setNewReport] = useState({
    patientEmail: "",
    patientName: "",
    department: "Cardiology",
    diagnosis: "",
    prescription: "",
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  });

  const handleAddReport = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/add-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newReport,
          doctorName: doctorName
        })
      });
      const data = await response.json();
      alert(typeof data?.message === 'string' ? data.message : "Report added successfully");
      if (response.ok) {
        setNewReport({ patientEmail: "", patientName: "", department: "Cardiology", diagnosis: "", prescription: "", date: newReport.date });
      }
    } catch(err) {
      alert("Failed to add report");
    }
  };



  return (
    <div className="dashboard doctor-dashboard">
      <div className="dashboard-header">
        <h1>Doctor Dashboard</h1>
        <button 
          className="outline-btn" 
          style={{width: 'auto', marginTop: '0', padding: '8px 20px', borderColor: '#ef4444', color: '#ef4444'}}
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            setPage("choose-role");
          }}
        >
          Logout
        </button>
      </div>
      <div className="dashboard-navbar">
        <ul>
          <li onClick={() => { setActiveCard(""); window.scrollTo({top: 0, behavior: 'smooth'}); }} className={!activeCard ? "active" : ""}>Dashboard</li>
          <li onClick={() => setActiveCard("patients")} className={activeCard === 'patients' ? "active" : ""}>Patients</li>
          <li onClick={() => setActiveCard("appointments")} className={activeCard === 'appointments' ? "active" : ""}>Appointments</li>
          <li onClick={() => setActiveCard("notifications")} className={activeCard === 'notifications' ? "active" : ""}>Notifications</li>
        </ul>
      </div>


      <div className="dashboard-grid">

        <div 
          className={`dashboard-card stat-card-doc clickable-card ${activeCard === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveCard("patients")}
        >
          <div className="card-icon">👥</div>
          <h2>Total Patients</h2>
          <p className="card-value">124</p>
          <p className="card-subtext">+12 this week</p>
        </div>
        
        <div 
          className={`dashboard-card stat-card-doc clickable-card ${activeCard === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveCard("appointments")}
        >
          <div className="card-icon">📅</div>
          <h2>Upcoming Appointments</h2>
          <p className="card-value">{Array.isArray(appointments) ? appointments.length : 0}</p>
          <p className="card-subtext">Total</p>
        </div>

        
        <div 
          className={`dashboard-card stat-card-doc clickable-card ${activeCard === 'prescriptions' ? 'active' : ''}`}
          onClick={() => setActiveCard("prescriptions")}
        >
          <div className="card-icon">💊</div>
          <h2>Prescriptions Given</h2>
          <p className="card-value">45</p>
          <p className="card-subtext">This month</p>
        </div>
        
        <div 
          className={`dashboard-card notifications-card clickable-card ${activeCard === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveCard("notifications")}
        >
          <div className="card-header">
            <span className="icon">🔔</span>
            <h2>Notifications</h2>
          </div>
            <ul className="notification-list">
              {!Array.isArray(notificationsList) || notificationsList.length === 0 ? (
                <li>No new notifications</li>
              ) : (
                notificationsList.slice(0, 3).map((n, i) => (
                  <li key={i}><span className="dot unread"></span> {String(n?.text || "Notification").substring(0, 25)}...</li>
                ))
              )}
            </ul>

            <p className="click-to-view">Click to view all</p>
          </div>
        </div>


      {activeCard && (
        <div className="expanded-section slide-in" ref={expandedViewRef}>


          <div className="expanded-header">
            <h2>
              {activeCard === 'patients' && "Patient List"}
              {activeCard === 'appointments' && "Appointments List"}
              {activeCard === 'prescriptions' && "Prescription History"}
              {activeCard === 'notifications' && "All Notifications"}
            </h2>
            <button className="close-btn" onClick={() => setActiveCard("")}>✖</button>
          </div>
          
          <div className="expanded-content">
            {activeCard === 'patients' && (
              <div className="table-responsive">
                <table className="dashboard-table">
                  <thead>
                    <tr><th>Name</th><th>Age</th><th>Disease</th><th>Next Appointment</th></tr>
                  </thead>
                  <tbody>
                    {patientsList.map((p, i) => (
                      <tr key={i}><td>{p.name}</td><td>{p.age}</td><td>{p.disease}</td><td>{p.date}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeCard === 'appointments' && (
              <div className="table-responsive">
                <table className="dashboard-table">
                  <thead>
                    <tr><th>Patient Name</th><th>Date</th><th>Time</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {!Array.isArray(appointments) || appointments.length === 0 ? (
                      <tr><td colSpan="5" style={{textAlign: 'center'}}>No appointments found.</td></tr>
                    ) : (
                      appointments.map((a, i) => (
                        <tr key={i}>
                          <td>{String(a?.patientName || "N/A")}</td><td>{String(a?.date || "N/A")}</td><td>{String(a?.time || "N/A")}</td>
                          <td><span className="status-badge upcoming">Upcoming</span></td>
                          <td>
                            <button 
                              onClick={() => handleCancelAppointment(a?._id)}
                              style={{padding: '4px 8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em'}}>
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeCard === 'patients' && (
              <div style={{padding: '10px', position: 'relative'}}>
                <h3 style={{marginBottom: '15px', color: '#1e3a8a'}}>Add Medical Report</h3>
                <form onSubmit={handleAddReport} style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', background: '#f8fafc', padding: '15px', borderRadius: '8px'}}>
                  <input 
                    type="text" 
                    placeholder="Patient Name" 
                    required 
                    value={newReport.patientName} 
                    onChange={e => setNewReport(prev => ({...prev, patientName: e.target.value}))} 
                    style={{padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', color: '#334155', minWidth: '200px'}} 
                  />
                  <input 
                    type="email" 
                    placeholder="Patient Email" 
                    required 
                    value={newReport.patientEmail} 
                    onChange={e => setNewReport(prev => ({...prev, patientEmail: e.target.value}))} 
                    style={{padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', color: '#334155', minWidth: '200px'}} 
                  />
                  <input 
                    type="text" 
                    placeholder="Diagnosis" 
                    required 
                    value={newReport.diagnosis} 
                    onChange={e => setNewReport(prev => ({...prev, diagnosis: e.target.value}))} 
                    style={{padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', color: '#334155', minWidth: '200px'}} 
                  />
                  <input 
                    type="text" 
                    placeholder="Prescription" 
                    required 
                    value={newReport.prescription} 
                    onChange={e => setNewReport(prev => ({...prev, prescription: e.target.value}))} 
                    style={{padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', color: '#334155', minWidth: '200px'}} 
                  />
                  <input 
                    type="text" 
                    placeholder="Department" 
                    required 
                    value={newReport.department} 
                    onChange={e => setNewReport(prev => ({...prev, department: e.target.value}))} 
                    style={{padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'white', color: '#334155', minWidth: '200px'}} 
                  />
                  <button type="submit" className="primary-btn" style={{width: 'auto', padding: '10px 25px'}}>Add Report</button>
                </form>
              </div>
            )}




            {activeCard === 'prescriptions' && (

              <div>
                <form onSubmit={handleAddPrescription} style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px', background: '#f8fafc', padding: '15px', borderRadius: '8px'}}>
                  <input type="email" placeholder="Patient Email" required value={newPrescription.patientEmail} onChange={e => setNewPrescription({...newPrescription, patientEmail: e.target.value})} style={{padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px'}} />
                  <input type="text" placeholder="Medicine" required value={newPrescription.medicine} onChange={e => setNewPrescription({...newPrescription, medicine: e.target.value})} style={{padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px'}} />
                  <input type="text" placeholder="Dosage" required value={newPrescription.dosage} onChange={e => setNewPrescription({...newPrescription, dosage: e.target.value})} style={{padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px'}} />
                  <input type="text" placeholder="Duration (e.g. 5 days)" required value={newPrescription.duration} onChange={e => setNewPrescription({...newPrescription, duration: e.target.value})} style={{padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px'}} />
                  <input type="text" placeholder="Instructions" value={newPrescription.instructions} onChange={e => setNewPrescription({...newPrescription, instructions: e.target.value})} style={{padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px'}} />
                  <button type="submit" className="primary-btn">Add Prescription</button>
                </form>

                <div className="table-responsive">
                  <table className="dashboard-table">
                    <thead>
                      <tr><th>Patient Name</th><th>Medicine</th><th>Dosage</th><th>Date</th></tr>
                    </thead>
                    <tbody>
                      {prescriptionsList.map((p, i) => (
                        <tr key={i}><td>{p.name}</td><td>{p.medicine}</td><td>{p.dosage}</td><td>{p.date}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeCard === 'notifications' && (
              <ul className="full-notification-list">
                {Array.isArray(notificationsList) && notificationsList.map((n, i) => (
                  <li key={i} className={n?.unread ? "unread-notif" : "read-notif"}>
                    <span className={`dot ${n?.unread ? 'unread' : ''}`}></span>
                    <div className="notif-content">
                      <p className="notif-text">{String(n?.text || "New Notification")}</p>
                      <span className="notif-time">{String(n?.time || "N/A")}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}