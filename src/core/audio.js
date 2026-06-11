window.KA = window.KA || {};

const musicState = {
  tracks: {},
  currentKey: null,
  unlocked: false,
  volume: 0.45,
};

function registerMusicTracks(tracks = {}) {
  Object.assign(MUSIC_TRACKS, tracks);
}

function musicTrack(key) {
  if (!key || !(key in MUSIC_TRACKS) || typeof Audio === "undefined") return null;

  if (!musicState.tracks[key]) {
    const track = new Audio(MUSIC_TRACKS[key]);
    track.loop = true;
    track.preload = "auto";
    track.volume = musicState.volume;
    musicState.tracks[key] = track;
  }

  return musicState.tracks[key];
}

function unlockMusic() {
  if (musicState.unlocked) return;
  musicState.unlocked = true;
  updateMusicForScene();
}

function updateMusicForScene() {
  if (!musicState.unlocked || ui.quit) return;

  const key = currentScene().musicKey;
  if (!key || key === musicState.currentKey) return;

  pauseCurrentMusic();

  const nextTrack = musicTrack(key);
  if (!nextTrack) return;

  musicState.currentKey = key;
  nextTrack.currentTime = 0;
  nextTrack.volume = musicState.volume;

  const playPromise = nextTrack.play();
  if (playPromise?.catch) {
    playPromise.catch(() => {
      if (musicState.currentKey === key) musicState.currentKey = null;
      musicState.unlocked = false;
    });
  }
}

function pauseCurrentMusic() {
  if (!musicState.currentKey) return;

  const currentTrack = musicTrack(musicState.currentKey);
  if (currentTrack) {
    currentTrack.pause();
    currentTrack.currentTime = 0;
  }

  musicState.currentKey = null;
}

window.KA.music = {
  state: musicState,
  registerTracks: registerMusicTracks,
  track: musicTrack,
  unlock: unlockMusic,
  updateForScene: updateMusicForScene,
  pauseCurrent: pauseCurrentMusic,
};
