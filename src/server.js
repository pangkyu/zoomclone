import http from "http";
import WebSocket from "ws";
import express from "express";

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
const wss = new WebSocket.Server({server}); 


const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    console.log("Connected to Browser ✅");
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));
    socket.on("message", (message) => {
      const msgStr = message.toString('utf8');
      sockets.forEach(aSocket => aSocket.send(msgStr));
    });
  });
  
  server.listen(3000, handleListen);