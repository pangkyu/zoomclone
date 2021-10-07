# socket IO

- 소켓 IO는 실시간, 양방향, 이벤트 기반의 통신을 가능하게 해준다.
- 웹소켓보다 탄력이 뛰어나다.

- 실행방법

```js
    import http from "http";
    import express from "express";
    import SocketIO from "socket.io";
    const app = express();

    app.set("view engine", "pug");
    app.set("views", __dirname + "/views");
    app.use("/public", express.static(__dirname + "/public));
    app.get("/", (_,res) => res.render("home"));
    app.get("/*", (_,res) => res.redirect("/"));

    const server = http.createServer(app);
    const io = SocketIo(server);
    const handleListen = () => console.log(`Listening on http://localhost:3000`);
    server.listen(3000, handleListen);

```

- 소켓io는 재연결과 같은 부가기능이 있다.
- socketIo를 사용할때 백엔드와 프론트엔드 둘다 설치를 해줘야한다.
  ==> websocket은 기본적으로 있는 api지만 socketIo는 아니기 때문에.

- io()는 알아서 socket.io를 실행하고 있는 서버를 찾는다.

---

- socket.emit()

  - event를 발생시키는 함수. 이렇게 서버쪽에서 이벤트를 발생시키면 클라이언트 페이지의 해당 이벤트 리스너에서 처리한다.
  - socket.emit을 이용하면 해당 소켓을 통해 상대편으로 전달하고, io.emit을 이용하면 서버가 현재 접속해있는 모든 클라이언트에게 이벤트를 전달한다.
  - 오브젝트도 전송가능

  ```js
  //ex
  socket.emit("enter_room", { payload: input.value }, () => {
    console.log("server is done!");
  }); // 첫 arg = event 이름 , 두번째 arg = 보내고 싶은 payload , 세번째 arg = 서버에서 호출하는 func
  ```

  ```js
  io.on("connection", (socket) => {
    socket.on("enter_room", (msg, done) => {
      setTimeout(() => {
        done();
      }, 10000);
    });
  });
  ```

  - emit과 on의 호출이름이 같아야한다.
  - 서버는 백엔드에서 function을 호출하지만 function은 프론트엔드에서 실행이 된 것이다.
