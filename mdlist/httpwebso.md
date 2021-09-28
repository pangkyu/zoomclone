# http vs Websockets

- websocket 덕분에 실시간 chat, notification 같은 real time을 만들 수 있다.

- http --> stateless
  ==> 백엔드가 유저를 기억하지 못한다.
  (request <-> response만 한다.)
  ==> 백엔드가 유저에게 메세지를 보낼 수 없다. (리퀘스트에 대한 답만 가능)

- websocket
  ==> 브라우저 서버간 커넥션이 되어있는 상태
  ==> 백엔드도 유저에게 메세지를 보낼 수 있다. (서로에게 가능)

- ws
  - ws : implementation , webSocket의 핵심부분.

```js
// install
// 터미널에서 npm i ws
```

---

- http 와 ws 합치기

```js
import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

//다음과 같이 하면 http서버, webSocket서버 둘 다 돌릴 수 있다.
// http서버 위에 웹소켓 서버를 만듦
const handleListen = () => console.log(`Listening on http://localhost:3000`);
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(3000, handleListen);
```

---

- http 서버가 필요한 이유
  - views, static files, home, redirection을 원하기 때문이다.

---

- 커넥션

- webSocket을 이용해 backend와 연결하는 예)
  ```js
     const aWebSocket = new WebSocket(url [, protocols]);
  ```

---

```js
//server.js

wss.on("connection", (socket) => {
  console.log("Connected to Browser ✅");
  socket.on("close", () => console.log("Disconnected from the Browser ❌"));
  socket.on("message", (message) => {
    console.log(message.toString("utf-8"));
  });
  socket.send("hello!!!");
});
```

```js
//app.js
const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("message", (message) => {
  console.log("New message: ", message.data);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

setTimeout(() => {
  socket.send("hello from the browser!");
}, 10000);
```

- 1. 커넥션이 발생. 커넥션이 발생하면 socket에서 누가 연결했는지 알 수 있다.
  2. 자바스크립트에서 방금 연결된 socket을 넣어준다. (브라우저가 연결되어 브라우저마다 연결된 소켓에서 이벤트를 listen할 수 있다.)
  3. 전원을 끄는 등의 close 이벤트가 발생하면 해당 이벤트 함수를 실행한다.
  4. socket.on("message")는 특정 소켓에서 메시지를 받았을 때 발생한다.
