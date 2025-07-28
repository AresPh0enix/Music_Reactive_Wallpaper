const canvas = document.getElementById("audioCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const img = document.getElementById("album-art");
const colorThief = new ColorThief();

img.addEventListener("load", () => {
  const dominantColor = colorThief.getColor(img); // es. [r,g,b]

  // Esempio: cambia sfondo liquido in base al colore
  canvas.style.background = `radial-gradient(circle, rgba(${dominantColor.join(",")},0.4), black)`;
});

let audioCtx, analyser, source;
let bufferLength, dataArray;

let particles = [];

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

class Particle {
  constructor(x, y, radius, hue) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.hue = hue;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.alpha = 0.8;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.005;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
    ctx.shadowBlur = 25;
    ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.6)`;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function animate() {
  requestAnimationFrame(animate);
  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < bufferLength; i++) {
    const radius = dataArray[i] / 4;
    const angle = (i / bufferLength) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * 200;
    const y = centerY + Math.sin(angle) * 200;
    const hue = i * 3;

    particles.push(new Particle(x, y, radius, hue));
  }

  particles.forEach((p, index) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) particles.splice(index, 1);
  });
}

window.onload = setupAudio;
const canvas = document.getElementById("audioCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let audioCtx, analyser, source;
let bufferLength, dataArray;

let particles = [];

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

class Particle {
  constructor(x, y, radius, hue) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.hue = hue;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.alpha = 0.8;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.005;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
    ctx.shadowBlur = 25;
    ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.6)`;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function animate() {
  requestAnimationFrame(animate);
  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  for (let i = 0; i < bufferLength; i++) {
    const radius = dataArray[i] / 4;
    const angle = (i / bufferLength) * Math.PI * 2;
    const x = centerX + Math.cos(angle) * 200;
    const y = centerY + Math.sin(angle) * 200;
    const hue = i * 3;

    particles.push(new Particle(x, y, radius, hue));
  }

  particles.forEach((p, index) => {
    p.update();
    p.draw();
    if (p.alpha <= 0) particles.splice(index, 1);
  });
}

window.onload = setupAudio;
