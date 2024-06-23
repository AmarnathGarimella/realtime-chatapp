const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const messagesRouter = require("./routes/messagesRoute");
const socket = require("socket.io");

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRouter);
app.use("/api/messages", messagesRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to mongoDB successfully");
  })
  .catch((e) => {
    console.error(`Some Error ocurred when connecting to mongoDB: ${e}`);
  });

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on port: ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
  socket.on("logout", (userId) => {
    onlineUsers.delete(userId.userId);
    socket.disconnect();
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});
