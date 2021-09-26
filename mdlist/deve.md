# 개발환경 설치

- nodemon.json 설정

  - 터미널에서 npm i @babel/core @babel/cli @babel/node @babel/preset-env -D

  - nodemon에 있는 exec => src/server.js에 대해 babel-node 명령문을 실행하는 것.

- express 설정
  - 터미널에서 npm i express, npm i pug 입력

```js
import express from "express";

const app = express();

app.set("view engine", "pug"); // pug를 뷰엔진으로 사용
app.set("views", __dirname + "/views"); // view 디렉토리를 입력 , __dirname : 현재 실행하는 파일의 절대경로
app.use("/public", express.static(__dirname + "/public")); // /public으로 이동할 시 public폴더 내용을 볼 수 있다.
app.get("/", (req, res) => res.render("home")); //홈페이지로 이동시 사용될 템플릿을 렌더링

const handleListen = () => console.log(`Listening on http://localhost:3000`);

app.listen(3000, handleListen);
```

---

- mvp css
- css 라이브러리

- nodemon
- 프로젝트를 살펴보고 변경 사항이 있을 시 서버를 재시작해주는 프로그램

- public 폴더
- 유저에게 공개해 주는 것들
