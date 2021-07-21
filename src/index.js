const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const path = require("path")
const port = process.env.PORT || 3000
const { Server } = require("socket.io");
const io = new Server(server);
const formatMessage = require("./utils/messages")
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./utils/users")

//Static
app.use(express.static(path.join(__dirname, "public")))

//Run when client connects
io.on("connection", socket => {

   socket.on("joinRoom", ({ username, room }) => {
      const user = userJoin(socket.id, username, room)

      socket.join(user.room);
      //Welcome current user
      socket.emit("message", formatMessage("BOT", `Welcome`))
      //Broadcast when an user connects
      socket.broadcast
         .to(user.room)
         .emit("message", formatMessage("BOT", `${user.username} has joined the chat`))

      //Run when client disconects
      socket.on("disconnect", () => {
         const user = userLeave(socket.id)
         if (user) {
            io.to(user.room).emit("message", formatMessage("BOT", `${user.username} has left the chat`))
         }
      })

      //Socket escuchando al evento chatMessage
      socket.on("chatMessage", (msg) => {
         const user = getCurrentUser(socket.id);
         console.log(socket.id)

         io.to(user.room)
            .emit("message", formatMessage(user.username, msg))
      })

      //Send users in room
      io.to(user.room).emit("roomUsers", {
         room: user.room,
         users: getRoomUsers(user.room)
      })

   })
})

server.listen(port, () => console.log(`Example app listening on port ${port}`))