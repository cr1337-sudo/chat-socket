const express = require('express')
const app = express()
const path = require("path")
const port = process.env.PORT || 3000
//--------------Socket io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const socketFunc = require("./socket.io/socket")
const onConnection = (socket) => { socketFunc(io, socket) }
//--------------Socket io
const mainRoutes = require("./routes/main.routes")
const exphbs = require('express-handlebars');



//Static
app.use(express.static(path.join(__dirname, "public")))
//View engine
app.set("views", path.join(__dirname, "./views"))
app.engine('.hbs', exphbs({
   defaultLayout: null,
   extname: ".hbs"
}));
//Configuracion para que .hbs sea la extension de los templates
app.set('view engine', '.hbs');

//Routes
app.use("", mainRoutes)

//Run when client connects
io.on("connection", socket => {
   onConnection(socket)
})


server.listen(port, () => console.log(`Example app listening on port ${port}`))