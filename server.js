import path from "path";
import express from "express";
import dotenv from "dotenv";
import { chats } from "./data/data.js";
import connectToMongo from "./db/db.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { Server } from "socket.io";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
dotenv.config();
const __dirname = path.resolve();

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("API running");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

app.use(express.static(path.join(__dirname, "/chithi-chat/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "chithi-chat", "dist", "index.html"));
});

const server = app.listen(port, () => {
  connectToMongo();
  console.log(`App running on http://localhost:${port}`);
});

const io = new Server(server, {
  pingTimeout: 6000000,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const userSocketMap = {};
io.on("connection", (socket) => {
  console.log("Connected to socket.io", socket.id);
  // const userId = socket.handshake.query.userId;
  // console.log(userId);
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    const userId = userData._id;
    if (userId != "undefined") userSocketMap[userId] = socket.id;
    console.log(userSocketMap);
    // console.log(userData._id);
    socket.emit("connected");
    socket.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
  socket.on("joinChat", (room) => {
    socket.join(room);
    console.log("user join room" + room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });
  socket.on("stopTyping", (room) => {
    socket.in(room).emit("stopTyping");
  });

  socket.on("newMessage", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) {
      return console.log("chat.users not defined");
    }
    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) {
        return;
      }
      socket.in(user._id).emit("messageReceived", newMessageReceived);
    });
  });
  socket.on("disconnect", (userId) => {
    console.log("Disconnected ", userId);
    // console.log(userData._id)
    console.log(userSocketMap[userId]);
    // socket.leave(userData._id);
    delete userSocketMap[userId];
    console.log(userSocketMap);
    socket.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
