// Selection of the DOM
const canvas = document.getElementById("audioCanvas");
const ctx = canvas.getContext("2d");
const albumArt = document.getElementById("album-art");
const songTitle = document.getElementById("song-title");
const artistName = document.getElementById("artist-name");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Initial color of the waves
let waveColor = "#1DB954"; // Green Spotify
let t = 0;

// 🌊 Animazione fluida canvas
function drawFluidWaves() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();

  for (let i = 0; i < canvas.width; i += 2) {
    let y = canvas.height / 2 +
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

// Fetch the track from Spotify
async function fetchCurrentTrack() {
  const token = localStorage.getItem("spotifyToken");
  if (!token) return;

  const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: "Bearer " + token }
  });

  if (response.ok) {
    const data = await response.json();
    if (!data || !data.item) return;

    const track = {
      title: data.item.name,
      artist: data.item.artists[0].name,
      cover: data.item.album.images[0].url
    };
    updateTrackInfo(track);
  }
}

// Updates the UI and the color of the waves
function updateTrackInfo(track) {
  if (songTitle.textContent !== track.title) {
    t += 20; // Impulso all'onda al cambio traccia
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

// Start fetch periodically
setInterval(fetchCurrentTrack, 5000);

setInterval(fetchCurrentTrack, 5000); // Update every 5 seconds

// Start the simulation
updateTrackInfo(mockTrack);
