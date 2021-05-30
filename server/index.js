const http = require("http"),
express = require("express"),
app = express(),
socketIo = require("socket.io");

const server = http.Server(app).listen(5000);
const io = socketIo(server);
const clients = {};

app.use(express.static(__dirname + "/../client/"));
app.use(express.static(__dirname + "/../node_modules/"));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname + "/../client" });
});

const addClient = socket => {
  clients[socket.id] = socket;
};
const removeClient = socket => {
  delete clients[socket.id];
};

io.sockets.on("connection", socket => {
  let id = socket.id;

  addClient(socket);

  socket.on("mousemove", data => {
    //parse jwt
    //parse user image as well
    data.id = id;
    socket.broadcast.emit("moving", data);
  });

  socket.on("disconnect", () => {
    removeClient(socket);
    socket.broadcast.emit("clientdisconnect", id);
  });
});
