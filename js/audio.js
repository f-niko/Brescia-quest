let audioPlayer = null;
let audioPlaying = false;
const FILE_AUDIO = 'guantanamo.mp3';

function initAudio() {
  if (audioPlayer) {
    if (audioPlaying) return;
    audioPlayer.play()
      .then(() => {
        audioPlaying = true;
        aggiornaInterfacciaAudio(true);
      })
      .catch(err => console.log("Riproduzione fallita:", err));
    return;
  }

  audioPlayer = new Audio(FILE_AUDIO);
  audioPlayer.loop = true;
  audioPlayer.volume = 0.5;

  audioPlayer.play()
    .then(() => {
      audioPlaying = true;
      aggiornaInterfacciaAudio(true);
    })
    .catch((err) => {
      console.log("Autoplay bloccato dal browser. In attesa di interazione valida.", err);
    });
}

function toggleAudio() {
  if (!audioPlayer) {
    initAudio();
    return;
  }

  if (audioPlaying) {
    audioPlayer.pause();
    audioPlaying = false;
    aggiornaInterfacciaAudio(false);
  } else {
    audioPlayer.play()
      .then(() => {
        audioPlaying = true;
        aggiornaInterfacciaAudio(true);
      })
      .catch((err) => {
        console.error("Impossibile riprodurre l'audio:", err);
      });
  }
}

function aggiornaInterfacciaAudio(isPlaying) {
  const icon = document.getElementById('audio-icon');
  const control = document.getElementById('audio-control');
  if (!icon || !control) return;

  if (isPlaying) {
    icon.textContent = '🔊';
    control.classList.add('playing');
  } else {
    icon.textContent = '🔇';
    control.classList.remove('playing');
  }
}

function gestisciPrimoClick() {
  initAudio();
  document.removeEventListener('click', gestisciPrimoClick);
  document.removeEventListener('touchstart', gestisciPrimoClick);
}

document.addEventListener('click', gestisciPrimoClick);
document.addEventListener('touchstart', gestisciPrimoClick);
