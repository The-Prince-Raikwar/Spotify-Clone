let currentSong = new Audio();
let songs;
let currFolder;
function secoondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00"
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(remainingSeconds).padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li><img src="images/music-note-01-Stroke-Rounded.png">
              <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>PRINCE</div>
              </div>
              <div class="playnow">
                <span>Play Now</span>
                <img src="images/play-circle-02-Stroke-Rounded.png">
              </div> </li>`;
  }

  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML)

    })
  })
  return songs

}
const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track
  if (!pause) {
    currentSong.play();
    play.src = "pause.svg"
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function displayAlbum() {
  let a = await fetch(`http://127.0.0.1:5500/spotify%20project/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];


    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0];

      let a = await fetch(`http://127.0.0.1:5500/spotify%20project/songs/${folder}/info.json`);
      let response = await a.json();

      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
            <div  class="play">
              <img src="images/play-Stroke-Rounded.png" alt="">
            </div>
            <img src="/spotify%20project/songs/${folder}/cover.jpg.jpg">
            <h2>${response.title}</h2>
            <p>${response.description}</p>

          </div>`
    }
  }
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getSongs(`spotify%20project/songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0])
    })
  })
}

async function main() {

  await getSongs("spotify%20project/songs/CS");
  playMusic(songs[0], true)

  displayAlbum();


  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play()
      play.src = "pause.svg"

    }
    else {
      currentSong.pause()
      play.src = "images/play-circle-02-Stroke-Rounded.png"
    }

  })
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secoondsToMinutesSeconds(currentSong.currentTime)} / ${secoondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";

  })
  document.querySelector(".seekbar").addEventListener("click", e => {
    let precent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = precent + "%";
    currentSong.currentTime = ((currentSong.duration) * precent) / 100
  })

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
  })

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%"
  })

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1])
    }

  })
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
    }
  })
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    currentSong.volume = parseInt(e.target.value) / 100;
    if (currentSong.volume > 0) {
      document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "vol.svg");
    }
  })

  document.querySelector(".volume>img").addEventListener("click", e => {
    if (e.target.src.includes("vol.svg")) {
      e.target.src = e.target.src.replace("vol.svg", "mute.svg");
      currentSong.volume = 0;
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0
    }
    else {
      e.target.src = e.target.src.replace("mute.svg", "vol.svg");
      document.querySelector(".range").getElementsByTagName("input")[0].value = 30
      currentSong.volume = .90;
    }
  })


}
main();
