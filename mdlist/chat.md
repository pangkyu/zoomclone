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

---

- JSON을 이용하여 두가지 문자열 받기

```pug
   <!-- home.pug -->
   body
       header
           h1 Noom
       main
           form#nick
               input(type = "text", placeholder = "choose a nickname", required)
               button Save
           ul
           form#message
               input(type = "text", placeholder = "write a msg", required)
               button send
```

```js
//app.js
const nickForm = document.querySelector("#nick");
const messageForm = document.querySelector("#message");

socket.addEventListener("message", (message) => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value)); // 프론트엔드에서 백엔드로 정보 전달
  input.value = "";
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
}
messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
```

- nickname과 message를 구분해야한다.
- JSON.Stringify(), JSON.parse() 활용

※ JSON.parse() -> parse 메소드는 string 객체를 JSON객체로 변환
JSON.stringify() -> JSON객체를 String 객체로 변환시켜 준다.

- object형태가 아닌 string형태로 데이터를 보내주어야한다.
  ==> 받는 환경이 java일지 go일지 js 등등 알수 없기때문에
