const express = require("express");
const router = express.Router();
const {
    askView,
    getPatientById,
    getAllPatientNames,
    getMedicationsByPatient,
  } = require("../controllers/patientController");
const {verify} = require('../middlewares/verifyJwt');
router.post('/ask',verify,askView);
router.get('/names',verify,getAllPatientNames);
router.get('/:id',verify,getPatientById);

router.get('/:id/medications',verify,getMedicationsByPatient);



module.exports=router;