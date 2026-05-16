export default function RescheduleAppointment({ setPage }) {

  function handleSubmit(event) {

    event.preventDefault();

    alert("Reschedule request sent to doctor");

    setPage("patient-dashboard");
  }

  return (

    <div className="login-container">

      <div className="login-box">

        <h1>Reschedule Appointment</h1>

        <form onSubmit={handleSubmit}>

          <input
            type="date"
            required
          />

          <input
            type="time"
            required
          />

          <textarea
            placeholder="Reason for rescheduling"
            required
          />

          <button type="submit">
            Send Request
          </button>

        </form>

      </div>

    </div>
  );
}