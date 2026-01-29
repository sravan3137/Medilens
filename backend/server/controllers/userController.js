const UserrSchema = require("../models/Userr.js");
const Request = require("../models/Requests.js");
const jwt = require('jsonwebtoken');
const axios = require("axios");
const createToken = async (user,res)=>{
    const email = user.email;
    const token = jwt.sign({email},process.env.ACCESS_SECRET,{expiresIn:'30m'});
    res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        sameSite:"Lax",
        path:"/",
        maxAge:30*60*1000,
    });
    return token;
};

const signup = async (req,res)=>{
    try{
        const userr = req.body;
        if(!userr || !userr.email) {
            return res.json({message:"No User Found"});
        }
        console.log("U: ",userr);
        const exists = await UserrSchema.findOne({'email':userr.email});
        if(exists){
            return res.json({message:"User Already Exists"});
        }
        const newUser = await UserrSchema.create(userr);
        const token = await createToken(userr,res);
        if(!token) return res.json({message:"email not verified"});
        const {password,...user}=newUser.toObject();
        return res.json({message:"User Registration Successfull",user,token});
    }catch(e){
        res.json({message:`Error at reguster,userController ${e}`});
    }
};
const login = async (req,res)=>{
    try{
        console.log("REQBOD:",req.body);
        const userr = req.body;
        if(!userr || !userr.username) {
            return res.json({message:"No User Found"});
        }
        const exists = await UserrSchema.findOne({'username':userr.username});
        if(!exists){
            return res.json({message:"User Not Found"});
        }
        if(exists.password!==userr.password) {
            return res.json({message:"Invalid username or password"});
        }
        const token= await createToken(exists,res);
        if(!token) return res.json({message:"email not verified"});
        const {password,...user} = exists.toObject();
        // console.log(exists,user);
        return res.json({message:"User Login Successfull",user,token});
    }catch(e){
        res.json({message:`Error at login,userController ${e}`});
    }
};
const profile = async (req,res)=>{
    try{
        const {username}=req.query;
            const exists = await UserrSchema.findOne({'username':username});
            if(!exists) return res.json({message:"User Not Found"});
            const {password,...user} = exists.toObject();
            res.json({message:"profile extraction successfull",user});
    }catch(e){
        res.json({message:`Error at profile,userController ${e}`});
    }
}
const logout = async (req,res)=>{
    try{
        res.clearCookie("token",{
            httpOnly:true,
            secure:false,
            sameSite:"Lax",
            path:"/",
            maxAge:30*60*1000,
        });
        console.log("OK");
        res.status(200).json({message:"Logout successfull"});
    }catch(e){
        res.status(500).json({message:`Error at userController ${e}`})
    }
}
const getUsers = async(req,res)=>{
    try{
        const {role,username} = req.params;
        // const toBeAdded = role==='doctor'?'patients':'doctors';
        const exUsers = await UserrSchema.find({'username':username}).select("connections");
        console.log("Eu:",exUsers);
        const excludedUsers = exUsers[0]?.connections;

        const targetRole = role==="patient"?"doctor":"patient";
        console.log("EU:",excludedUsers);
        const users = await UserrSchema.find({
            'role':targetRole,
            'username': {$nin:excludedUsers}
        }).select("username");
        console.log("U:",users);

        res.status(200).json({message:"Got Users successfully",users});
    }catch(e){
        console.log(`error at getUsers,userController ${e}`);
        res.status(405).json({message:`error at getUsers,userController ${e}`});
    }
}
const addUsers = async(req,res)=>{
    try{
        const username= req.params?.username||"";
        // console.log("U:",username); 
        // console.log("R:",req.body);
        const toBeAdded = req.body?.addedConnections || [];
        
        const added = await UserrSchema.findOneAndUpdate(
            {'username':username},
            {$addToSet:{'connections':{$each: toBeAdded}}},
            {new:true}
        );
        res.status(200).json({message:"update successfull"});
    }catch(e){
        console.log(`error at addUsers,userController ${e}`);
        res.status(405).json({message:`error at addUsers,userController ${e}`});
    }
}
const getConnections = async(req,res)=>{
    try{
        const username= req.params?.username||"";
        const mongDoc = await UserrSchema.findOne({username}).select("connections");
        const connections = mongDoc.connections;
        res.status(200).json({message:"Got COnnections Successfully",connections})
    }catch(e){
        console.log(`error at getConnections,userController ${e}`);
        res.status(405).json({message:`error at getConnections,userController ${e}`});
    }
}
const newRequest = async(req,res)=>{
    try{
        console.log("R: ",req.body);
        const { senderUsername, receiverUsername } = req.body;
        const existing = await Request.findOne(
            { senderUsername, receiverUsername,status:"pending" }
        );
        if (existing) return res.status(400).json({ msg: "Request already sent" });
        const newRequest = new Request({ senderUsername, receiverUsername });
        await newRequest.save();
        res.json({ msg: "Request sent successfully" });
    }catch(e){
        console.log(`error at newRequest,userController ${e}`);
        res.status(405).json({message:`error at newRequest,userController ${e}`});
    }
}
const getRequests = async(req,res)=>{
    try{
        console.log("PR: ",req.params);
        const rid = req.params.recieverUsername || "";
        const requests = await Request.find(
            { receiverUsername: rid, status: "pending" }
        );
        res.status(200).json({message:"got requests successfully",requests});
    }
    catch(e){
        console.log(`error at getRequests,userController ${e}`);
        res.status(405).json({message:`error at getRequests,userController ${e}`});
    }
}
const response = async(req,res)=>{
    try{
        
        const {status,senderUsername, receiverUsername} = req.body;
        const updated = await Request.findOneAndUpdate(
            {senderUsername, receiverUsername,status:"pending" }, 
            { status: status }, 
            { new: true }
        );
        if(status==="accept"){
            const added = await UserrSchema.findOneAndUpdate(
                {'username':senderUsername},
                {$addToSet:{'connections':receiverUsername}},
                {new:true}
            );
            const added1 = await UserrSchema.findOneAndUpdate(
                {'username':receiverUsername},
                {$addToSet:{'connections':senderUsername}},
                {new:true}
            );
        }
        res.status(200).json({message:"Responded to the request successfully",updated});

    }catch(e){
        console.log(`error at response,userController ${e}`);
        res.status(405).json({message:`error at response,userController ${e}`});
    }
}
const ask = async(req,res)=>{
    try{
        const {user_id, question,role } = req.body;
        if(!user_id || !question) {
            const text = `user_id and question are required to ask the llm but ${!user_id&&!question?'both ':!user_id?'user_id ':'question ' } not found `;
            return res.status(400).json({error:text});
        }
        console.log(user_id,question,role);
        const resp = await axios.post("http://127.0.0.1:8000/ask",{
            user_id,
            question,
            role
        });
        // console.log("received:",resp.data.answer );
        return res.status(200).json({answer:resp.data.answer});
    }catch(e){
        console.log(`Errr at /ask, ${e.errors}`);
        return res.status(500).json({error:"At /ask in usercontroller.js"});
    }
}
module.exports={signup,login,profile,logout,getUsers,getConnections,addUsers,newRequest,getRequests,response,ask}
