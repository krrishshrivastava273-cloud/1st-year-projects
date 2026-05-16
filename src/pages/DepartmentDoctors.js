import { useState, useEffect } from 'react';

export default function DepartmentDoctors({ title }) {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:5001/doctors');
        const data = await response.json();
        if (Array.isArray(data)) {
          const filteredDoctors = data.filter(doc => doc.department === title);
          setDoctors(filteredDoctors);
        } else {
          setDoctors([]);
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, [title]);

  const bookAppointment = async (doctorName) => {
    const patientEmail = localStorage.getItem("userEmail");
    if(!patientEmail) {
      alert("Please login to book an appointment.");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5001/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientEmail,
          doctorName,
          department: title,
          date: 'Tomorrow', 
          time: '10:30 AM'
        })
      });
      const data = await response.json();
      alert(data.message);
    } catch(err) {
      alert("Error booking appointment. Ensure backend is running.");
    }
  };

  const renderDoctors = (doctors) => {
    if (doctors.length === 0) {
      return <p>No doctors found for this department.</p>;
    }
    return (
      <div className="doctor-list">
        {Array.isArray(doctors) && doctors.map((doc, index) => (
          <div className="doctor-card" key={index}>
            <div className="doctor-top">
              <img
                src={String(doc?.image || "")}
                alt={String(doc?.name || "Doctor")}
              />
              <div>
                <h2>{String(doc?.name || "Doctor")}</h2>
                <p className="category">{String(doc?.department || title)} Specialist</p>
                <p className="review">⭐ 4.9 ({String(doc?.reviews || 0)} Reviews)</p>
                <p className="experience">10+ Years Experience</p>
              </div>
            </div>
            <button className="book-btn" onClick={() => bookAppointment(doc?.name)}>
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>{title} Specialists</h1>

      {renderDoctors(doctors)}

    </div>
  );
}