// // models/Patient.js
// const { DataTypes } = require("sequelize");
// const { sequelize } = require("../config/sdb.js");
// const test = async () =>{
//   const result = await sequelize.getQueryInterface().showAllTables();
//   console.log(result);
// };
// test();

// const Patient = sequelize.define(
//   "Patient",
//   {
//     patient_id: { type: DataTypes.STRING, primaryKey: true }, // PAT100 is string!
//     name: { type: DataTypes.STRING },
//     gender: { type: DataTypes.STRING },
//     dob: { type: DataTypes.STRING },  // or DATEONLY if stored as YYYY-MM-DD
//     age: { type: DataTypes.INTEGER },
//     height_cm: { type: DataTypes.FLOAT },
//     weight_kg: { type: DataTypes.FLOAT },
//     bmi: { type: DataTypes.FLOAT },
//     conditions: { type: DataTypes.STRING },
//   },
//   {
//     tableName: "patients", // EXACT table name in DB
//     timestamps: false,    // prevents Sequelize from adding createdAt, updatedAt
//     freezeTableName: true // prevents pluralization
//   }
// );

// module.exports = { Patient };
