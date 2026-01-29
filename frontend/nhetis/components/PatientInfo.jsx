import React from "react";

function PatientInfo({ patient }) {
  if (!patient) return <p>No patient data</p>;

  return (
    <div className="container">
      <span className="container">
        <h1 className="display-6 mb-0">
          Patient info <i className="bi bi-info-circle-fill"></i>
        </h1>
      </span>
      <div className="card" style={{ width: "18rem" }}>
        <div className="card-body">
          <p className="card-text">
            Name: <span className="fw-light">{patient.name}</span>
          </p>
          <p className="card-text">
            Patient ID: <span className="fw-light">{patient.patient_id}</span>
          </p>
          <p className="card-text">
            Age: <span className="fw-light">{patient.age}</span>
          </p>
          <p className="card-text">
            Gender: <span className="fw-light">{patient.gender}</span>
          </p>
          <p className="card-text">
            DOB: <span className="fw-light">{patient.dob}</span>
          </p>
          <p className="card-text">
            Conditions: <span className="fw-light">{patient.conditions}</span>
          </p>
          <p className="card-text">
            Height: <span className="fw-light">{patient.height_cm} cm</span>
          </p>
          <p className="card-text">
            Weight: <span className="fw-light">{patient.weight_kg} kg</span>
          </p>
          <p className="card-text">
            BMI: <span className="fw-light">{patient.bmi} kg/m<sup>2</sup></span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PatientInfo;



