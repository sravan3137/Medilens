// // models/Medication.js
// const { DataTypes } = require("sequelize");
// const { sequelize } = require("../config/sdb.js");

// const Medication = sequelize.define(
//   "Medication",
//   {
//     patient_id: { type: DataTypes.STRING },  // PAT100 etc.
//     medication: { type: DataTypes.STRING },
//     dose: { type: DataTypes.STRING },
//     frequency: { type: DataTypes.STRING },
//     start_date: { type: DataTypes.STRING },   // or DATEONLY
//     stop_date: { type: DataTypes.STRING },    // or DATEONLY
//   },
//   {
//     tableName: "medications", 
//     timestamps: false,
//     freezeTableName: true
//   }
// );

// module.exports = { Medication };
