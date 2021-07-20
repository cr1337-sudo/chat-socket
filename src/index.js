const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const path = require("path")
const port = process.env.PORT || 3000
const { Server } = require("socket.io");
const io = new Server(server);
const formatMessage = require("./utils/messages")
const { userJoin, getCurrentUser } = require("./utils/users")

//Static
app.use(express.static(path.join(__dirname, "public")))

//Run when client connects
io.on("connection", socket => {


   socket.emit("message", formatMessage("BOT", `Welcome`))
   //Broadcast when an user connects
   socket.broadcast.emit("message", formatMessage("BOT", "An user has joined the chat"))



   //Run when client disconects
   socket.on("disconnect", () => {
      io.emit("message", formatMessage("BOT", "An user has left the chat"))
   })

   //Socket escuchando al evento chatMessage
   socket.on("chatMessage", (msg) => {
      io.emit("message", formatMessage("User", msg))
   })

})

server.listen(port, () => console.log(`Example app listening on port ${port}`))