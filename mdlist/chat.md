# chat

※ message로 들어오는 부분을 toString('utf8')처리해야 오류가 발생하지 않음

```js
// server.js
// ...
const sockets = [];
wss.on("connection", (socket) => {
  sockets.push(socket);
  //...
  socket.on("message", (message) => {
    const msgStr = message.toString("utf8");
    sockets.forEach((aSocket) => aSocket.send(msgStr));
  });
});
```

```js
const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");

//...
function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(input.value); // 프론트엔드 form에서 백엔드로 정보전달
  input.value = "";
}
messageForm.addEventListener("submit", handleSubmit);
```

- 커넥션이 될때 socket을 받아 sockets에 추가한다.
- submit 이벤트가 발생하면 handleSubmit 함수에서 input된 값을 받아 소켓으로 그 값을 전송한다.
- message로 소켓이 활성화되면 입력된 message를 toString('utf8')처리하여 msgStr변수에 담는다.
- sockets 배열을 forEach로 돌면서 각각의 배열 소켓들에게 msgStr을 send시킨다.
