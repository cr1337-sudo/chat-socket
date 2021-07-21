const socket = io()
const chatForm = document.getElementById("chat-form")
const chatMsgDiv = document.querySelector(".chat-messages")
const roomName = document.getElementById("room-name")
const roomUsers = document.getElementById("users")

//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
   ignoreQueryPrefix: true
})

//Mostrar texto en DOM
const outputMessage = (message) => {
   chatMsgDiv.insertAdjacentHTML("beforeend",
      `<div class="message">
   <p class="meta">${message.username}<span> ${message.time}</span></p>
   <p class="text">
   ${message.text}
   </p>
   </div>`
   )
   //Scroll bottom
   chatMsgDiv.scrollTop = chatMsgDiv.scrollHeight
}
//Room name
const outputRoomName = (room) => {
   roomName.innerText = room
}
//User list in room
const outputRoomUsers = (users) => {
   roomUsers.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join("")}`
}

//Enviar datos de usuario y room
socket.emit("joinRoom", { username, room })

//Logica previa a enviar mensajes
socket.on("message", message => {
   outputMessage(message)
})

//Get room users
socket.on("roomUsers", ({ room, users }) => {
   outputRoomName(room);
   outputRoomUsers(users)
})
//Message submit
chatForm.addEventListener("submit", (e) => {
   e.preventDefault()
   //Por si se cambia la estructura, así se conserva la funcionalidad
   const msg = e.target.elements.msg.value;
   socket.emit("chatMessage", msg);
   //Clear input
   e.target.elements.msg.value = ""
   e.target.elements.msg.focus()
})

