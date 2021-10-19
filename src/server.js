//import WebSocket from "ws";
import http from "http";

import express from "express";
import SocketIo from "socket.io";
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_,res)=> res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));


//다음과 같이 하면 http서버, webSocket서버 둘 다 돌릴 수 있다.
// http서버 위에 웹소켓 서버를 만듦 
const handleListen = () => console.log(`Listening on http://localhost:3000`);
const server = http.createServer(app);
const io = SocketIo(server);

io.on("connection", (socket) => {
  socket["nickname"] = "anonymous";
  socket.onAny((event)=>{
    console.log(`Socket event : ${event}`);
  });
  socket.on("enter_room", (roomName, nickname, done) => {   
    socket["nickname"] = nickname;
    socket.join(roomName);
    socket.to(roomName).emit("welcome", socket.nickname);
    done();
  });
  socket.on("disconnecting" , () =>{
    socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname));
  });
  socket.on("new_message", (msg, room, done) =>{
    socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});


//const wss = new WebSocket.Server({server}); 


/*
  - websocket *
const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser ✅");
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));
    socket.on("message", (msg) => {
    const msgStr = msg.toString('utf8');
    const message = JSON.parse(msgStr);
    switch(message.type){
      case "new_message":
        sockets.forEach(aSocket => aSocket.send(`${socket.nickname} : ${message.payload}`));
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
    }
    });
  });
  */
  server.listen(3000, handleListen);

