import { useState } from "react";

export default function Signup({ setPage }) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "patient"
  });

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const url = formData.role === "doctor" ? "http://localhost:5001/doctor/signup" : "http://localhost:5001/patient/signup";
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (response.ok) {
        alert("Signup Successful");
        if (formData.role === "doctor") {
          setPage("doctor-login");
        } else {
          localStorage.setItem("userEmail", formData.email);
          localStorage.setItem("userName", formData.name);
          localStorage.setItem("userRole", "patient");
          setPage("home");
        }
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Create Account</h1>
        <p className="subtitle">Join Docease</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Enter Phone Number"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            onChange={handleChange}
            required
          />
          <select 
            name="role" 
            onChange={handleChange} 
            value={formData.role}
            style={{ padding: '15px', borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.2)', color: '#333', fontSize: '16px' }}
          >
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="bottom-text">
          Already have an account?
          <span className="link" onClick={() => setPage("login")}> Login</span>
        </p>
      </div>
    </div>
  );
}