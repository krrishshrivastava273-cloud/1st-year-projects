import { useState, useEffect, useRef } from "react";


export default function PatientDashboard({ setPage }) {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  
  const email = localStorage.getItem("userEmail") || "sundarlal374@gmail.com";
  const name = localStorage.getItem("userName") || "Sundar Lal";

  const appointmentsRef = useRef(null);
  const profileRef = useRef(null);
  const reportsRef = useRef(null);


  const loadData = async () => {
    try {
      const apptRes = await fetch(`http://localhost:5001/appointments/${email}`);
      if (apptRes.ok) {
        const data = await apptRes.json();
        setAppointments(Array.isArray(data) ? data : []);
      }
      
      const presRes = await fetch(`http://localhost:5001/prescriptions/${email}`);
      if (presRes.ok) {
        const data = await presRes.json();
        setPrescriptions(Array.isArray(data) ? data : []);
      }

      const repRes = await fetch(`http://localhost:5001/reports/${email}`);
      if (repRes.ok) {
        const data = await repRes.json();
        setReports(Array.isArray(data) ? data : []);
      }
    } catch(err) {
      console.log("Error fetching data:", err);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleCancelAppointment = async (appointmentId) => {
    if(!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      const response = await fetch(`http://localhost:5001/cancel-appointment/${appointmentId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      alert(data?.message || "Appointment cancelled");
      if(response.ok) loadData();
    } catch(err) {
      alert("Error cancelling appointment");
    }
  };

  const handleReschedule = async (appointmentId) => {

    const newDate = prompt("Enter new date (e.g., 25 May 2026):");
    const newTime = prompt("Enter new time (e.g., 02:00 PM):");
    if(!newDate || !newTime) return;
    
    try {
      const response = await fetch('http://localhost:5001/reschedule-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentId, newDate, newTime })
      });
      const data = await response.json();
      alert(data?.message || "Appointment rescheduled");
      if(response.ok) loadData();
    } catch(err) {
      alert("Error rescheduling appointment");
    }
  };

  const handleDownloadPDF = async (report) => {
    try {
      const response = await fetch(`http://localhost:5001/download-report/${report._id}`);
      
      if (response.status === 404) {
        alert("Report not found");
        return;
      }
      
      if (!response.ok) {
        throw new Error("Download failed");
      }

      // Process the PDF blob from response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Docease_Report_${(report?.date || "date").replace(/ /g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      alert("Download success");
    } catch (err) {
      console.error("Download Error:", err);
      alert("Download failed");
    }
  };

  const handleDeleteReport = async (reportId) => {
    if(!window.confirm("Are you sure you want to delete this report?")) return;
    try {
      const response = await fetch(`http://localhost:5001/delete-report/${reportId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      alert(data?.message || "Report deleted");
      if(response.ok) loadData();
    } catch(err) {
      alert("Error deleting report");
    }
  };



  return (
    <div className="dashboard patient-dashboard-container">
      <div className="dashboard-header">
        <h1>Patient Dashboard</h1>
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
          <li onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="active">Dashboard</li>
          <li onClick={() => appointmentsRef.current?.scrollIntoView({behavior: 'smooth'})}>Appointments</li>
          <li onClick={() => profileRef.current?.scrollIntoView({behavior: 'smooth'})}>Profile</li>
          <li onClick={() => reportsRef.current?.scrollIntoView({behavior: 'smooth'})}>Reports</li>
        </ul>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card profile-card" ref={profileRef}>


          <div className="card-header">
            <span className="icon">👤</span>
            <h2>Patient Profile</h2>
          </div>
          <div className="card-body">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Age:</strong> 23</p>
            <p><strong>Blood Group:</strong> O+</p>
            <p><strong>Email:</strong> {email}</p>
          </div>
        </div>

        <div className="dashboard-card appointment-card" ref={appointmentsRef}>


          <div className="card-header">
            <span className="icon">📅</span>
            <h2>Upcoming Appointments</h2>
          </div>
          <div className="card-body">
            {!Array.isArray(appointments) || appointments.length === 0 ? <p>No upcoming appointments.</p> : appointments.map((appt, i) => (
              <div key={i} style={{marginBottom: '15px', padding: '10px', background: '#f8fafc', borderRadius: '8px'}}>
                <p><strong>Doctor:</strong> {String(appt?.doctorName || "Unknown")}</p>
                <p><strong>Department:</strong> {String(appt?.department || "N/A")}</p>
                <p><strong>Date:</strong> {String(appt?.date || "N/A")}</p>
                <p><strong>Time:</strong> {String(appt?.time || "N/A")}</p>
                <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                  <button className="primary-btn" onClick={() => handleReschedule(appt._id)}>Reschedule</button>
                  <button className="outline-btn" onClick={() => handleCancelAppointment(appt._id)} style={{borderColor: '#ef4444', color: '#ef4444'}}>Cancel</button>
                </div>
              </div>

            ))}
          </div>
        </div>

        <div className="dashboard-card prescription-card">
          <div className="card-header">
            <span className="icon">📝</span>
            <h2>Prescriptions</h2>
          </div>
          <div className="card-body">
            {!Array.isArray(prescriptions) || prescriptions.length === 0 ? <p>No prescriptions found.</p> : prescriptions.map((pres, i) => (
              <div key={i} style={{marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px'}}>
                <p><strong>Medicine:</strong> {String(pres?.medicine || "N/A")}</p>
                <p><strong>Dosage:</strong> {String(pres?.dosage || "N/A")}</p>
                <p><strong>Instructions:</strong> {String(pres?.instructions || "N/A")}</p>
                <p><strong>Doctor:</strong> {String(pres?.doctorName || "Unknown")}</p>
                <button className="outline-btn" style={{marginTop: '10px'}}>Download</button>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card medicine-card">
          <div className="card-header">
            <span className="icon">💊</span>
            <h2>Medicines</h2>
          </div>
          <div className="card-body">
            <p><strong>Medicine:</strong> Dolo 650</p>
            <p><strong>Timing:</strong> Morning & Night</p>
            <p><strong>Status:</strong> <span className="badge warning">5 Days Remaining</span></p>
          </div>
        </div>

        <div className="dashboard-card report-card" ref={reportsRef}>


          <div className="card-header">
            <span className="icon">📊</span>
            <h2>Medical Reports</h2>
          </div>
          <div className="card-body">
            {!Array.isArray(reports) || reports.length === 0 ? <p>No reports found.</p> : reports.map((report, i) => (
              <div key={i} style={{marginBottom: '15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px'}}>
                <p>📄 <strong>{String(report?.department || "General")} Checkup</strong> - {String(report?.date || "N/A")}</p>
                <p style={{fontSize: '0.9em', color: '#64748b'}}>Dr. {String(report?.doctorName || "Unknown")}</p>
                <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                  <button 
                    className="outline-btn" 
                    onClick={() => handleDownloadPDF(report)}
                    style={{fontSize: '0.9em', padding: '6px 12px'}}>
                    Download PDF
                  </button>
                  <button 
                    className="outline-btn" 
                    onClick={() => handleDeleteReport(report._id)}
                    style={{fontSize: '0.9em', padding: '6px 12px', borderColor: '#ef4444', color: '#ef4444'}}>
                    Delete
                  </button>
                </div>
              </div>

            ))}
          </div>
        </div>
      </div>
    </div>
  );
}