// const { Patient } = require("../models/Patient");
// const { Medication } = require("../models/Medication");
// const { Sequelize, fn, col, where } = require("sequelize");

// exports.askView = async (req, res) => {
//   try {
//     const { patient, question } = req.body;
//     if (!patient || !question) {
//       return res.status(400).json({ error: "Both 'patient' and 'question' are required." });
//     }

//     let patientRecord;
//     if (!isNaN(Number(patient))) {
//       patientRecord = await Patient.findOne({ where: { patient_id: Number(patient) } });
//     } else {
//       const nameLower = String(patient).toLowerCase();
//       patientRecord = await Patient.findOne({
//         where: where(fn("lower", col("name")), nameLower),
//       });
//     }

//     if (!patientRecord) {
//       return res.status(404).json({ error: "Patient not found" });
//     }

//     const meds = await Medication.findAll({
//       where: { patient: patientRecord.patient_id },
//       attributes: ["medication", "dose", "frequency", "start_date", "stop_date"],
//     });

//     let answer;
//     const questionLower = question.toLowerCase();
//     if (questionLower.includes("medic") || questionLower.includes("drug") || questionLower.includes("dose")) {
//       if (!meds.length) {
//         answer = `No medications found for ${patientRecord.name}.`;
//       } else {
//         answer = `Medications for ${patientRecord.name}: ` +
//           meds.map(m => `${m.medication} (${m.dose || "dose N/A"}, ${m.frequency || "freq N/A"})`).join("; ");
//       }
//     } else {
//       answer = {
//         summary: { patient_id: patientRecord.patient_id, name: patientRecord.name },
//         medications: meds,
//         note: "This is a rule-based answer. Integrate an AI service for natural language answers."
//       };
//     }

//     return res.json({ result: answer });
//   } catch (err) {
//     console.error("askView error:", err);
//     res.status(500).json({ error: "An internal error occurred." });
//   }
// };

// exports.getPatientByName = async (req, res) => {
//   try {
//     const name = req.params.name;
//     const patient = await Patient.findOne({
//       where: where(fn("lower", col("name")), name.toLowerCase()),
//     });
//     if (!patient) return res.status(404).json({ error: "Patient not found" });
//     return res.json(patient);
//   } catch (err) {
//     console.error("getPatientByName:", err);
//     res.status(500).json({ error: "An internal error occurred." });
//   }
// };

// exports.getAllPatientNames = async (req, res) => {
//   try {
//     const patients = await Patient.findAll({ attributes: ["name"] });
//     const names = patients.map(p => p.name);
//     return res.json(names);
//   } catch (err) {
//     console.error("getAllPatientNames:", err);
//     res.status(500).json({ error: "An internal error occurred." });
//   }
// };

// exports.getMedicationsByPatient = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const patient = await Patient.findOne({ where: { patient_id: id } });
//     if (!patient) return res.status(404).json({ error: "Patient not found" });

//     const medications = await Medication.findAll({
//       where: { patient: patient.patient_id },
//       attributes: ["medication", "dose", "frequency", "start_date", "stop_date"],
//     });

//     return res.json({
//       patient_id: patient.patient_id,
//       name: patient.name,
//       medications,
//     });
//   } catch (err) {
//     console.error("getMedicationsByPatient:", err);
//     res.status(500).json({ error: "An internal error occurred." });
//   }
// };
const sqlite3 = require("sqlite3").verbose();
const path = "C:/Users/srava/OneDrive/Desktop/synthetic_pat.db";  // ✅ CHANGE THIS

const db = new sqlite3.Database(path, (err) => {
  if (err) console.error("Error opening database:", err.message);
  else console.log("✅ Connected to existing SQLite database.");
});

// Helper function to run SELECT queries with promises
function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

exports.askView = async (req, res) => {
  try {
    const { patient, question } = req.body;
    if (!patient || !question) {
      return res
        .status(400)
        .json({ error: "Both 'patient' and 'question' are required." });
    }

    let patientRecord;

    // If patient is numeric → search by patient_id
    if (!isNaN(Number(patient))) {
      const rows = await runQuery(
        "SELECT * FROM patient WHERE patient_id = ? LIMIT 1",
        [Number(patient)]
      );
      patientRecord = rows[0];
    } else {
      // Search by lower(name)
      const rows = await runQuery(
        "SELECT * FROM patient WHERE lower(name) = ? LIMIT 1",
        [patient.toLowerCase()]
      );
      patientRecord = rows[0];
    }

    if (!patientRecord) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Fetch medications
    const meds = await runQuery(
      "SELECT medication, dose, frequency, start_date, stop_date FROM medication WHERE patient = ?",
      [patientRecord.patient_id]
    );

    // Question handling logic
    let answer;
    const questionLower = question.toLowerCase();

    if (
      questionLower.includes("medic") ||
      questionLower.includes("drug") ||
      questionLower.includes("dose")
    ) {
      if (!meds.length) {
        answer = `No medications found for ${patientRecord.name}.`;
      } else {
        answer =
          `Medications for ${patientRecord.name}: ` +
          meds
            .map(
              (m) =>
                `${m.medication} (${m.dose || "dose N/A"}, ${
                  m.frequency || "freq N/A"
                })`
            )
            .join("; ");
      }
    } else {
      answer = {
        summary: {
          patient_id: patientRecord.patient_id,
          name: patientRecord.name,
        },
        medications: meds,
        note: "This is a rule-based answer. Integrate an AI service for natural language answers.",
      };
    }

    return res.json({ result: answer });
  } catch (err) {
    console.error("askView error:", err);
    res.status(500).json({ error: "An internal error occurred." });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const id = req.params.id.toLowerCase();
    const rows = await runQuery(
      "SELECT * FROM patients WHERE lower(patient_id) = ? LIMIT 1",
      [id]
    );
    const patient = rows[0];

    if (!patient) return res.status(404).json({ error: "Patient not found" });
    return res.json(patient);
  } catch (err) {
    console.error("getPatientById:", err);
    res.status(500).json({ error: "An internal error occurred." });
  }
};

exports.getAllPatientNames = async (req, res) => {
  try {
    const rows = await runQuery("SELECT name,patient_id FROM patients");
    const data = rows.map((p) => ({
      name: p.name,
      id: p.patient_id
    }));
    return res.json(data);
  } catch (err) {
    console.error("getAllPatientNames:", err);
    res.status(500).json({ error: "An internal error occurred." });
  }
};

exports.getMedicationsByPatient = async (req, res) => {
  try {
    const id = req.params.id;

    const patientRows = await runQuery(
      "SELECT * FROM patients WHERE patient_id = ? LIMIT 1",
      [id]
    );
    const patient = patientRows[0];
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const medications = await runQuery(
      "SELECT medication, dose, frequency, start_date, stop_date FROM medications WHERE patient_id = ?",
      [patient.patient_id]
    );

    return res.json({
      patient_id: patient.patient_id,
      name: patient.name,
      medications,
    });
  } catch (err) {
    console.error("getMedicationsByPatient:", err);
    res.status(500).json({ error: "An internal error occurred." });
  }
};
