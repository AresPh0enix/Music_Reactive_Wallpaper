const canvas = document.getElementById("audioCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let audioCtx, analyser, source;
let bufferLength, dataArray;

function setupAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);
    animate();
  });
}

function animate() {
  requestAnimationFrame(animate);
  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background gradient
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width
  );
  gradient.addColorStop(0, "rgba(0,10,30,0.5)");
  gradient.addColorStop(1, "rgba(0,0,0,1)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Liquid blobs
  for (let i = 0; i < dataArray.length; i++) {
    const radius = dataArray[i] / 2;
    const angle = (i / bufferLength) * Math.PI * 2;
    const x = canvas.width / 2 + Math.cos(angle) * 200;
    const y = canvas.height / 2 + Math.sin(angle) * 200;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${i * 3}, 100%, 50%, 0.7)`;
    ctx.fill();
  }
}

window.onload = setupAudio;

setInterval(fetchCurrentTrack, 5000); // Update every 5 seconds

// Start the simulation
updateTrackInfo(mockTrack);
