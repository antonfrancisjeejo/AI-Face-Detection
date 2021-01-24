const video = document.getElementById("video");

Promise.all([
  //to load the face accurately
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  //to draw the box
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  // to recognize the face
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  //to find expression
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo());

function startVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
    })
    .catch(function (error) {
      console.log(error);
    });
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = {
    width: video.width,
    height: video.height,
  };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    // console.log(detections);
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  }, 100);
});
