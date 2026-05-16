export default function Home({ setPage }) {
  return (
    <div className="home-container">

     

      <nav className="home-navbar">
        <h2 style={{ cursor: "pointer" }} onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}>Docease</h2>
        <ul>
          <li onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}>Home</li>
          <li onClick={() => setPage("departments")}>Departments</li>
          <li onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>Contact Us</li>
          <li onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            setPage("choose-role");
          }} style={{color: '#ef4444', fontWeight: 'bold'}}>Logout</li>
        </ul>
      </nav>

      

      <div className="hero-section" id="hero">

        {/* LEFT */}

        <div className="hero-left">

          <h1>
            Compassionate Care For Your Health
          </h1>

          <p>
            Book appointments with trusted doctors and
            manage your health easily.
          </p>

          <button
            className="hero-btn"
            onClick={() => setPage("patient-dashboard")}
          >
            Patient Dashboard
          </button>

        </div>

        {/* RIGHT */}

        <div className="hero-right">

          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
            alt="doctor"
          />

        </div>

      </div>

      {/* STATS */}

      <div className="stats-section">

        <div className="stat-card">
          <h2>20+</h2>
          <p>Years Experience</p>
        </div>

        <div className="stat-card">
          <h2>95%</h2>
          <p>Patient Satisfaction</p>
        </div>

        <div className="stat-card">
          <h2>5000+</h2>
          <p>Patients Served</p>
        </div>

      </div>

      {/* DEPARTMENTS */}

      <div className="departments-section">

        <h1>Our Departments</h1>

        <div className="department-grid">

          <div
            className="department-card clickable"
            onClick={() => setPage("cardiology")}
          >
            <div className="dept-icon">❤️</div>
            <h3>Cardiology</h3>
            <p>Heart Care & Surgery</p>
          </div>

          <div
            className="department-card clickable"
            onClick={() => setPage("neurology")}
          >
            <div className="dept-icon">🧠</div>
            <h3>Neurology</h3>
            <p>Brain & Nerve Care</p>
          </div>

          <div
            className="department-card clickable"
            onClick={() => setPage("dental")}
          >
            <div className="dept-icon">🦷</div>
            <h3>Dental</h3>
            <p>Complete Oral Care</p>
          </div>

          <div
            className="department-card clickable"
            onClick={() => setPage("orthopedic")}
          >
            <div className="dept-icon">🦴</div>
            <h3>Orthopedic</h3>
            <p>Bone & Joint Care</p>
          </div>

        </div>

      </div>

      {/* CONTACT SECTION */}
      <footer className="contact-section" id="contact">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Contact Us</h2>
            <p><strong>Address:</strong> 123 Health Avenue, Medical City, MC 10012</p>
            <p><strong>Email:</strong> support@docease.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p className="emergency"><strong>Emergency:</strong> 911 or +1 (555) 999-9999</p>
          </div>
          <div className="contact-socials">
            <h2>Follow Us</h2>
            <div className="social-icons">
              <span>📘 Facebook</span>
              <span>🐦 Twitter</span>
              <span>📸 Instagram</span>
              <span>💼 LinkedIn</span>
            </div>
          </div>
        </div>
        <div className="contact-bottom">
          <p>&copy; 2026 Docease. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}