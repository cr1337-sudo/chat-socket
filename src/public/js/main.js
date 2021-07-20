const socket = io()
const chatForm = document.getElementById("chat-form")
const chatMsgDiv = document.querySelector(".chat-messages")


//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
   ignoreQueryPrefix: true
})

console.log(username, room)
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

//Enviar datos de usuario y room
socket.emit("joinRoom", { username, room })

//Logica previa a enviar mensajes
socket.on("message", message => {
   outputMessage(message)
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

