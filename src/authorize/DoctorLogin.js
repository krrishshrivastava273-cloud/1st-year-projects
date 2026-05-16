import { useState } from "react";

export default function DoctorLogin({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/doctor/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        alert("Login successful");
        const doctorName = data?.user?.name || email;
        localStorage.setItem("doctorEmail", email);
        localStorage.setItem("doctorName", doctorName);
        localStorage.setItem("userRole", "doctor");
        setPage("doctor-home");
      } else {
        alert("Error: " + (typeof data?.message === 'string' ? data.message : JSON.stringify(data?.message) || "Unknown error"));
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
        <h1>Doctor Login</h1>
        <p className="subtitle">Welcome Doctor</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Doctor Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="forgot" onClick={() => setPage("forgot")}>
          Forgot Password?
        </p>
        <p className="bottom-text">
          Don't have an account?
          <span className="link" onClick={() => setPage("signup")}> Sign Up</span>
        </p>
      </div>
    </div>
  );
}