export default function Departments({ setPage }) {
  const departments = [
    { name: "Cardiology", pageKey: "cardiology" },
    { name: "Neurology", pageKey: "neurology" },
    { name: "Dental", pageKey: "dental" },
    { name: "Orthopedic", pageKey: "orthopedic" },
  ];

  return (
    <div className="departments-container">
      <div className="departments-header">
        <h1>Our Departments</h1>
        <p>Explore our world-class medical departments and find the right specialist for you</p>
      </div>

      <div className="departments-grid">
        {departments.map((dept) => (
          <div
            key={dept.pageKey}
            className="department-card-clickable"
            onClick={() => setPage(dept.pageKey)}
          >
            <h2>{dept.name}</h2>
            <p>View Doctors</p>
          </div>
        ))}
      </div>
    </div>
  );
}
