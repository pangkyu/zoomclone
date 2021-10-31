# video

- playsinline : 모바일 브라우저가 필요로 하는 property

```js
// app.js
const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");

let myStream;
let muted = false;
let cameraOff = false;
async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    myFace.srcObject = myStream;
  } catch (e) {
    console.log(e);
  }
}

getMedia();

function handleCameraClick() {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = "Turn Camera off";
    cameraOff = false;
  } else {
    cameraBtn.innerText = "Turn Camera on";
    cameraOff = true;
  }
}
function handleMuteClick() {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = "Unmute";
    muted = true;
  } else {
    muteBtn.innerText = "Mute";
    muted = false;
  }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
```

- async await으로 비동기처리하여서 다음 프로세스를 먼저 실행할 수 있도록 처리

- MediaDevices

  - MediaDevices 인터페이스는 카메라, 마이크, 공유 화면 등 현재 연결된 미디어 입력 장치로의 접근 방법을 제공하는 인터페이스이다.
  - event

    - devicechange
    - 사용자 컴퓨터에 미디어 입출력 장치가 추가/제거 됐을 때 발생한다.
    - ondevicechange 속성으로도 사용가능

  - 메서드

  1. enumerateDevices()

  - 시스템에서 사용 가능한 미디어 입출력 장치의 정보를 담은 배열을 가져온다.

  2. getSupportedConstraints()

  - MediaStreamTrack 인터페이스가 지원하는 제약을 나타내는 MediaTrackSupportedConstraints 호환 객체를 반환한다.

  3. getUserMedia()

  - 사용자에게 권한을 요청한 후, 시스템의 카메라와 오디오 각각 혹은 모두 활성화하여, 장치의 입력 데이터를 비디오/오디오 트랙으로 포함한 MediaStream을 발생

  4. getDisplayMedia()

  - MediaStream으로 캡처해 공유나 녹화 용도로 사용할 화면 혹은 화면의 일부(창)을 선택하도록 사용자에게 요청한다. MediaStream으로 이행하는 Promise를 반환.

---

- initialConstrains : deviceId가 없을 때 실행(camera를 만들기 전 )
- cameraConstraints : deviceId가 있을 때 실행

```js
cameraSelect.addEventListener("input", handleCameraChange);

function handleCameraChange() {
  await getMedia(cameraSelect.value);
}
async function getMedia(deviceId) {
  const initialConstrains = {
    audio: true,
    video: { facingMode: "user" },
  };
  const cameraConstraints = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstraints : initialConstrains
    );
    myFace.srcObject = myStream;
    if (!deviceId) {
      await getCameras();
    }
  } catch (e) {
    console.log(e);
  }
}
```

---

- webRTC
  - peer-to-peer 방식
  - 서버를 거치지않음
