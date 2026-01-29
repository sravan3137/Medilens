const express = require('express');
const router = express.Router();
const {login,logout,signup,profile,
    getUsers,getConnections,addUsers,newRequest,getRequests,response,ask} = require("../controllers/userController");
const {verify} = require('../middlewares/verifyJwt');

router.post('/login',login);
router.post('/register',signup);
router.get('/profile',verify,profile);
router.get('/getUsers/:role/:username',verify,getUsers);
router.post('/addUsers/:username',verify,addUsers);
router.get('/getConnections/:username',verify,getConnections);
router.post('/newRequest',verify,newRequest);
router.get('/getRequests/:recieverUsername',verify,getRequests);
router.put('/respond',verify,response);
router.get('/logout',logout);
router.post('/ask',ask);
module.exports=router;