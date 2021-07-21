const formatMessage = require("../utils/messages")
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("../utils/users")

module.exports = (io, socket) => {
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

         io.to(user.room)
            .emit("message", formatMessage(user.username, msg))
      })

      //Send users in room
      io.to(user.room).emit("roomUsers", {
         room: user.room,
         users: getRoomUsers(user.room)
      })

   })
}