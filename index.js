const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const socket = require("socket.io")

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRoutes);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    UseUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Db connections succesful`);
  })
  .catch((e) => {
    console.log("An error occured", e.message);
  });

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});

    const io = socket(server, {
      cors: {
        origin: "https://snappy-front-end.vercel.app",
        Credentials: true,
      },
    });

    global.onlineUsers = new Map();

    io.on("connection", (socket) => {
      global.chatSocket = socket;
      socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
      });

      socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
      });
    });
 
