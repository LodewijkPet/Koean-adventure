window.KA = window.KA || {};

const TILE = 32;
const WORLD_WIDTH = 42;
const WORLD_HEIGHT = 35;
const UI_FONT = '"Courier New", "Malgun Gothic", "Segoe UI", monospace';

const COLORS = {
  void: "#111217",
  grass: "#8fcf63",
  grassDark: "#6aa94b",
  grassLight: "#b8de78",
  path: "#d9bd7a",
  pathDark: "#b1915d",
  sand: "#e7d49a",
  sandDark: "#c8ad73",
  water: "#3c8dca",
  waterDark: "#2067a0",
  waterLight: "#77c3dc",
  stone: "#87919b",
  stoneDark: "#5e6973",
  hedge: "#3f8f45",
  hedgeDark: "#2c6738",
  trunk: "#805f34",
  roofRed: "#b44f4e",
  roofBlue: "#4f7fb4",
  roofTeal: "#4b9e91",
  roofViolet: "#8466a7",
  wall: "#e4d7aa",
  wallShadow: "#bda876",
  door: "#6e4b2d",
  black: "#151515",
  white: "#fffaf0",
  text: "#242424",
  panel: "#f7f1df",
  panelAccent: "#c04444",
  panelLine: "#63544a",
};

const DIRS = {
  down: { x: 0, y: 1 },
  up: { x: 0, y: -1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const keyToDir = {
  KeyW: "up",
  ArrowUp: "up",
  KeyS: "down",
  ArrowDown: "down",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
};

const LANGUAGES = [
  { code: "en", key: "language.english" },
  { code: "ko", key: "language.korean" },
  { code: "nl", key: "language.dutch" },
];

const MUSIC_TRACKS = {
  intro: "assets/audio/Intro.mp3",
  town1: "assets/audio/Town1.mp3",
  town2: "assets/audio/Town2.mp3",
  town3: "assets/audio/Intro.mp3",
  trail1: "assets/audio/Trail1.mp3",
  trail2: "assets/audio/Trail2.mp3",
};

const SOLID_TILES = new Set([
  "water",
  "stone",
  "hedge",
  "tree",
  "ledge",
  "wall",
  "bed",
  "bookcase",
  "brochureRack",
  "chair",
  "counter",
  "cushion",
  "desk",
  "fish",
  "fridge",
  "mapBoard",
  "produce",
  "sink",
  "stove",
  "supplyShelf",
  "table",
  "teaTable",
  "tv",
]);

window.KA.constants = {
  TILE,
  WORLD_WIDTH,
  WORLD_HEIGHT,
  UI_FONT,
  COLORS,
  DIRS,
  keyToDir,
  LANGUAGES,
  MUSIC_TRACKS,
  SOLID_TILES,
};
