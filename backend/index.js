const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const env = require("dotenv");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;
env.config();

app.use(express.json());
app.use(cors({
  origin: "https://chatappdef.vercel.app",
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}));
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log(`http://localhost:${port}`);
  })
  .catch((err) => {
    console.log(err);
  });

const authRouter = require("./routes/userRoutes");
app.use("/api", authRouter);
const chatRouter = require("./routes/chatRoutes");
app.use("/api", chatRouter);
const messageRouter = require("./routes/messageRoutes");
app.use("/api", messageRouter);

const server = app.listen(port, console.log("server is running..."));

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
  pingTimeout: 60000,
});

io.on("connection", (socket) => {
  socket.on("setup", (user) => {
    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (newMessageStatus) => {
    let chat = newMessageStatus.chat;
    if (!chat.users) {
      return console.log("chat.users not defined");
    }
    chat.users.forEach((user) => {
      if (user._id == newMessageStatus.sender._id) return;

      socket.in(user._id).emit("messsage recieved", newMessageStatus);
    });
  });
});
