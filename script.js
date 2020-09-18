// QR Library Documentation: https://github.com/LazarSoft/jsqrcode/blob/master/README

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("output-data");
const btnScanQR = document.getElementById("btn-scan-qr");
const imgInput = document.getElementById("img-input-qr");
const btnCancelScan = document.getElementById("cancel-scan");
const header1 = document.getElementById("header-1")
const header2 = document.getElementById("header-2");
const header3 = document.getElementById("header-3");

const headerText = header2.innerText;

//const hideClass = document.getElementsByClassName("hide-during-scan");

let scanning = false;

qrcode.callback = res => {
  if (res) {
    outputData.innerText = res;
    scanning = false;

    //if (String(res).match(/(?:(?:http|https)\:\/\/)?(?:\w{3,6}\.)?\w+\.\w{2,6}(?:\/\w+)*\/?/)) {qrResult.href = res}

    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => {
        track.stop();
      });
    }

    qrResult.hidden = false;
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
    imgInput.hidden = false;
    header1.hidden = false;
    header2.innerText = headerText;
    header3.hidden = false;
    btnCancelScan.hidden = true;

    //for (let i = 0; i < hideClass.length; i++) {
    //  hideClass[i].hidden = false;
    //}
  }
};

btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
      scanning = true;

      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      imgInput.hidden = true;
      header1.hidden = true;
      header2.innerText = "Scanning...";
      header3.hidden = true;
      btnCancelScan.hidden = false;

      //for (let i = 0; i < hideClass.length; i++) {
      //  hideClass[i].hidden = true;
      //}

      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    })
    .catch(err => {
      alert("Something went wrong.\nTry submitting a file instead.\n\nError: " + err.message);
      console.log(err);
    });
};

btnCancelScan.onclick = () => {
  scanning = false;

  if (video.srcObject) {
    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });
  }

  qrResult.hidden = outputData.innerText ? false : true;
  canvasElement.hidden = true;
  btnScanQR.hidden = false;
  imgInput.hidden = false;
  header1.hidden = false;
  header2.innerText = headerText;
  header3.hidden = false;
  btnCancelScan.hidden = true;
};

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}

function handleFiles(file) {
	for (let i = 0; i < file.length; i++) {
    let reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        qrcode.decode(e.target.result);
      };
    })
    (file[i]);
    reader.readAsDataURL(file[i]);	
  }
}
