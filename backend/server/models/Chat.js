const mongoose =require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  roomId: { type: String, unique: true },
  readStatus: {
    type: Map,
    of: Boolean, // { user1: true, user2: false }
    default: {},
  },
  lastRead: {
    type: Map,
    of: Boolean, // { user1: true, user2: false }
    default: {},
  },
  messages: [messageSchema],
  lastUpdated: { type: Date, default: Date.now },
});

module.exports=mongoose.model("Chat", chatSchema);
