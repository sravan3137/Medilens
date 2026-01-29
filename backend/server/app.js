const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const {Server} = require("socket.io");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db.js");
const { sequelize } = require("./config/sdb.js");
const Chat = require("./models/Chat.js");
const rateLimit = require("express-rate-limit");
dotenv.config();
const app = express();
const limiter = rateLimit({
  windowMs:15*60*1000,
  max:100,
  message:'Too Many Requests,try again later'
});
app.use(limiter);
console.log("RAG wont work because of replicate api token,model:https://replicate.com/ibm-granite/granite-3.3-8b-instruct,get token from the website.");
const patientRoutes = require('./routes/patientRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

app.use(cors({
  origin:'http://localhost:5173',
  credentials:true,
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

app.use('/patients',patientRoutes);
app.use('/users',userRoutes);
sequelize.authenticate()
  .then(() => console.log("✅ SQLite connected"))
  .catch(err => console.error("❌ SQLite connection error:", err));


connectDB();


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const onlineUsers = new Set();
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", async ({ roomId,userId }) => {
    socket.join(roomId);
    
    const readStat=await Chat.findOne({roomId},{readStatus:1});
    // console.log("RSS:",readStat);
    const read = readStat?.readStatus?.get(userId);
    io.to(roomId).emit("unread-update", { receiver:userId, roomId ,read});
    
  });
 
  socket.on("get-previous-messages",async({roomId,userId})=>{
    const chat = await Chat.findOne({ roomId });
    if (chat) {
      chat.readStatus.set(userId, true);
      chat.lastRead.set(userId,chat.messages[chat.messages.length-1]._id);
      await chat.save();
      io.to(socket.id).emit("previous-messages", chat.messages);
      io.to(roomId).emit("messages-read", { roomId, userId });
      onlineUsers.add(userId);
    } else {
      io.to(socket.id).emit("previous-messages", []);
    }
    // console.log("CM: ",chat?.messages);
  });
  socket.on("user-offline",async({userId})=>{
    if(onlineUsers.has(userId)) {
      onlineUsers.delete(userId);
      console.log(userId," went offline");
    }
  });
  socket.on("send-message", async ({ roomId, sender, receiver, message }) => {
    const newMessage = { sender, receiver, message, timestamp: new Date() };
    // console.log(receiver);
    // Append message to the array inside the same room document
    const read = onlineUsers.has(receiver);
    console.log("receiver update",read);
    const updatedChat = await Chat.findOneAndUpdate(
      { roomId },
      { 
        $push: { messages: newMessage },
        $set:{[`readStatus.${receiver}`]:read,lastUpdated:new Date()},
     },
      { new: true, upsert: true } // create if it doesn't exist
    );
    socket.on("messages-read", async ({ roomId, userId }) => {
      await Chat.updateOne(
        { roomId },
        { $set: { "messages.$[elem].readStatus": true } },
        { arrayFilters: [{ "elem.receiver": userId }] }
      );
      io.to(roomId).emit("messages-read", { roomId, userId });
    });
    
  
    io.to(roomId).emit("receive-message", newMessage);
    // Notify receiver (for unread badge update)
    // const read=onlineUsers.has(receiver);
    console.log("UU: ",roomId,receiver);
    io.to(roomId).emit("unread-update", { receiver, roomId ,read});
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server & socket.io running on port ${PORT}`));