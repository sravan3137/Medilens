import React from "react";

function MedicationInfo({ medications }) {
  if (!medications || medications.length === 0) {
    return <p>No medications found</p>;
  }

  return (
    <div className="container">
      <span className="container">
        <h1 className="display-6 mb-0">
          Medication <i className="bi bi-capsule"></i>
        </h1>
      </span>

      <table className="table table-striped table-bordered">
  <thead className="table-dark">
    <tr>
      <th>#</th>
      <th>Medication</th>
      <th>Dose</th>
      <th>Frequency</th>
      <th>Start Date</th>
      <th>Stop Date</th>
    </tr>
  </thead>
  <tbody>
    {medications.map((med, i) => (
      <tr key={i}>
        <td>{i + 1}</td>
        <td>{med.medication}</td>
        <td>{med.dose}</td>
        <td>{med.frequency}</td>
        <td>{med.start_date}</td>
        <td>{med.stop_date || "Ongoing"}</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}

export default MedicationInfo;
