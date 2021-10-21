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

- 클라이언트 측에서 socket.io모듈을 스크립트 시켜야한다.

```pug
   <script src = "/socket.io/socket.io.js"></script>
```

- socket.io 모듈은 내부적으로 "루트/socket.io"경로에 socket.io.js파일을 자동으로 등록해둔다.
- 단, 노드js 상에서 "socket.io 객체 생성시 설정한 path"경로로 접근해야한다. (생략시 디폴트가 /socket.io 로 지정됨)

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
  - 백엔드는 프론트엔드에서 오는 코드를 실행시키면 안된다. (보안문제 발생)

  - 내가 원하는 만큼 백엔드로 보낼수 있다. (무제한 arg)
    - 떄로는 socket에서 메세지를 받고싶을 때, 마지막 arg로 function을 보낸다. (콜백함수)
    - 이 함수는 백엔드에서 실행되는 것이 아님! (백엔드에서 실행되면 보안문제다. ) ==> db에 접근이 가능해질 수 있어서

---

socket.join

```js
//ex)
io.on("connection", (socket) => {
  console.log(socket.rooms); // Set { <socket.id> }
  socket.join("room1");
  console.log(socket.rooms); // Set { <socket.id>, "room1" }
});
```

---

- 웹소켓에서 Room 사용 -> 서로 소통을 할 수 있는 소켓 그룹이 필요하다.
  ==> socket IO는 기본적으로 room을 제공한다.

  - 구현방법

  - 서버 api에는 많은 옵션이 있는데 그 중 socket.id를 사용한다.

```js
io.on("connect", (socket) => {
  console.log(socket.rooms);
  socket.join("room1");
  console.log(socket.rooms); // Set { <socket.id>}
});
```

- disconnectiong
  - 고객이 접속을 중단할 것이지만 아직 방을 완전히 나가지는 않았음!
  ```js
  io.on("connection", (socket) => {
    socket.on("disconnecting", (reason) => {
      console.log(socket.rooms); // Set { ... }
    });
  });
  ```

※ done()은 백엔드에서 실행되는 것이 아님. 프론트엔드에서 코드를 실행하게 함
※ socket.io 가 겁나게 방대하니 document를 찾아보면서 공부하는 것도 좋음!

---

- adapter ==> 서버간의 통신을 해주는 것

---

- map,set,object

  - ES6에서 새로 도입한 자료구조

- Set, Map이 필요한 이유

  - object는 문자열/심볼 만 key값으로 들어간다. (map, set은 1dhk '1'도 구분된다. )
  - 객체의 프로퍼티의 개수를 알아야할 경우 (set, map -> size)
  - object는 for of 또는 spread syntax로 접근이 힘들다. (object는 not iterable)

- SET

  - 중복을 허용하지 않는 데이터 집합
  - set을 사용하면 데이터에 빠르게 엑세스 할 수 있다.
  - 1와 '1'은 다른것으로 간주 즉, 중복을 확인하기 위해 강제적으로 자료형을 변형하지 않는다.
  - forEach(callback(value, key, set)[, thisArg]), for of로 값에 접근이 가능하다.

  ```js
  const mySet = new Set(); // {}

  mySet.add(1); // {1}
  mySet.add(2); // {1,2}
  mySet.size; // 2
  mySet.delete(1); // {2}
  mySet.has(2); // true
  mySet.clear(); // {}

  let arr = [...mySet]; // Spread연산자를 이용해 array로 만들 수 있다.

  //array 중복제거 하고싶다면 Set바꿨다 arr하면 쉽게 해결
  function eliminateDuplicates(items) {
    return [...new Set(items)];
  }
  ```

  - WeakSet

    - set이 참조하는 것이 모두 사라졌을 때 원래(Set)는 유지 되지만 같이 사라지기 원한다면 --> new WeakSet()

    - has,add,delete만 지원
    - key는 반드시 object

    ```js
    let set = new WeakSet(),
      key = {};
    set.add(key);
    key = null;
    console.log(key); //false
    // 일반 set이었으면 set.size ==> 1
    ```

---

- Map

  - 객체는 키-값을 저장
  - Set과 마찬가지로 key는 자료형을 구분
  - Set처럼 배열을 넣어서 초기화 시킬 수도 있다.

  ```js
  let myMap = new Map();
  myMap.set(1, "HELLO"); // {1 => 'HELLO'}
  myMap.set("1", "HELLO"); // {1 => 'HELLO', '1' => 'HELLO'}
  myMap.set(1, "world"); // { 1 => 'world', '1' => 'HELLO'}
  ```

- WeakMap
- WeakMap도 참조하는 객체가 사라지면 자동으로 가비지 콜렉팅된다.
- WeakMap은 set,get,has,delete만 지원
- key는 반드시 object

- Object
- key-value 로 저장. key를 주로 property라고 부름
- object에서도 key는 unique하고 하나의 value와만 associated 되어있다.

---

- 방 목록을 표시하는 법

```js
// app.js
socket.on("room_change", (rooms) => {
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  const roomList = welcome.querySelector("ul");
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
```

- roomList는 항상 비워주는 걸로 시작.

```js
socket.on("disconnect", () => {
  io.sockets.emit("room_change", publicRooms());
});

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}
```
