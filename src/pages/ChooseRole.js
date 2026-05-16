export default function ChooseRole({ setPage }) {

  return (
    <div className="login-container">

      <div className="login-box">

        <h1>Choose Your Role</h1>

        <p className="subtitle">
          Continue as Patient or Doctor
        </p>

        <button
          onClick={() => setPage("login")}
        >
          Patient Login
        </button>

        <button
          onClick={() => setPage("doctor-login")}
        >
          Doctor Login
        </button>

      </div>

    </div>
  );
}