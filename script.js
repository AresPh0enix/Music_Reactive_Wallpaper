// Selezione elementi DOM
const canvas = document.getElementById("audioCanvas");
const ctx = canvas.getContext("2d");
const albumArt = document.getElementById("album-art");
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");

// Ridimensiona canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Colore iniziale delle onde
let waveColor = "#ffffff";

// Animazione fluida base
let t = 0;
function drawFluidWaves() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  for (let i = 0; i < canvas.width; i += 2) {
    let y =
      canvas.height / 2 +
      80 * Math.sin(i * 0.01 + t) *
      Math.sin(t * 0.02);
    ctx.lineTo(i, y);
  }

  ctx.strokeStyle = waveColor;
  ctx.lineWidth = 2;
  ctx.stroke();
  t += 0.6;

  requestAnimationFrame(drawFluidWaves);
}
drawFluidWaves();

// Simulazione metadati brano
const mockTrack = {
  title: "Lost Frequencies",
  artist: "EchoWave",
  cover: "assets/default_cover.jpg"
};

// Aggiorna UI
function updateTrackInfo(track) {
  if (songTitle.textContent !== track.title) {
    t += Math.random() * 20; // Boost temporaneo all'animazione
  }

  albumArt.src = track.cover;
  songTitle.textContent = track.title;
  artistName.textContent = track.artist;

  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = track.cover;

  img.onload = function () {
    const colorThief = new ColorThief();
    const dominantColor = colorThief.getColor(img);
    waveColor = `rgb(${dominantColor.join(",")})`;
  };
}

async function fetchCurrentTrack() {
  const token = localStorage.getItem("spotifyToken");
  const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: "Bearer " + token }
  });

  if (response.ok) {
    const data = await response.json();
    const track = {
      title: data.item.name,
      artist: data.item.artists[0].name,
      cover: data.item.album.images[0].url
    };
    updateTrackInfo(track);
  }
}

setInterval(fetchCurrentTrack, 5000); // Aggiornamento ogni 5 sec

// Avvia simulazione
updateTrackInfo(mockTrack);
