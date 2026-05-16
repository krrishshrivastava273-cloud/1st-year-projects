import { useState } from "react";

export default function OtpVerification({ setPage }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const email = localStorage.getItem("resetEmail");
      const response = await fetch('http://localhost:5001/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();

      if (response.ok) {
        alert("OTP Verified");
        setPage("reset");
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
        <h1>OTP Verification</h1>
        <p className="subtitle">Enter OTP</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}