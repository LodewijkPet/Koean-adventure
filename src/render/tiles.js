window.KA = window.KA || {};

function drawTile(tx, ty) {
  const x = Math.floor(tx * TILE - cameraX);
  const y = Math.floor(ty * TILE - cameraY);
  const type = tileAt(tx, ty);

  if (type === "void") {
    ctx.fillStyle = COLORS.void;
    ctx.fillRect(x, y, TILE, TILE);
    return;
  }

  if (currentScene().kind === "interior") {
    drawInteriorTile(x, y, tx, ty, type);
    return;
  }

  if (type === "bridge") {
    drawWater(x, y, tx, ty);
    return;
  }

  if (
    type === "grass" ||
    type === "flowers" ||
    type === "tree" ||
    type === "hedge" ||
    type === "ledge" ||
    type === "tallGrass"
  ) {
    drawGrass(x, y, tx, ty);
  }

  if (type === "path") drawPath(x, y, tx, ty);
  if (type === "sand") drawSand(x, y, tx, ty);
  if (type === "water") drawWater(x, y, tx, ty);
  if (type === "stone") drawStone(x, y, tx, ty);
  if (type === "hedge") drawHedge(x, y, tx, ty);
  if (type === "tree") drawTreeTile(x, y, tx, ty);
  if (type === "flowers") drawFlowers(x, y, tx, ty);
  if (type === "tallGrass") drawTallGrass(x, y, tx, ty);
  if (type === "ledge") drawLedge(x, y);
}

function drawInteriorTile(x, y, tx, ty, type) {
  if (type === "wall") {
    drawInteriorWall(x, y, tx, ty);
    return;
  }

  drawInteriorFloor(x, y, tx, ty);

  if (type === "tatami") drawMat(x, y, tx, ty, type, "#c9b86f", "#887b45");
  if (type === "carpetRed") drawMat(x, y, tx, ty, type, "#b85c54", "#7c3734");
  if (type === "carpetBlue") drawMat(x, y, tx, ty, type, "#5a82b4", "#36567d");
  if (type === "carpetGreen") drawMat(x, y, tx, ty, type, "#6f9a57", "#426436");
  if (type === "exit") drawInteriorExit(x, y);

  if (
    [
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
    ].includes(type)
  ) {
    drawFurnitureTile(x, y, type, tx, ty);
  }
}

function drawInteriorFloor(x, y, tx, ty) {
  ctx.fillStyle = "#caa66f";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = (tx + ty) % 2 === 0 ? "#d6b77d" : "#bd945f";
  ctx.fillRect(x, y + TILE - 4, TILE, 4);
  if (seeded(tx, ty) > 0.64) {
    ctx.fillStyle = "#b48656";
    ctx.fillRect(x + 7, y + 12, 8, 2);
  }
}

function drawInteriorWall(x, y, tx, ty) {
  ctx.fillStyle = "#b99068";
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = "#8d6849";
  ctx.fillRect(x, y + 21, TILE, 11);
  ctx.fillStyle = "#d8bd8a";
  ctx.fillRect(x + 3, y + 4, TILE - 6, 7);
  if (seeded(tx, ty) > 0.6) {
    ctx.fillStyle = "#6b4f3d";
    ctx.fillRect(x + 8, y + 23, 11, 3);
  }
}

function drawMat(x, y, tx, ty, type, fill, border) {
  const sameUp = tileAt(tx, ty - 1) === type;
  const sameDown = tileAt(tx, ty + 1) === type;
  const sameLeft = tileAt(tx - 1, ty) === type;
  const sameRight = tileAt(tx + 1, ty) === type;
  const leftInset = sameLeft ? 0 : 2;
  const rightInset = sameRight ? 0 : 2;
  const topInset = sameUp ? 0 : 2;
  const bottomInset = sameDown ? 0 : 2;

  ctx.fillStyle = fill;
  ctx.fillRect(
    x + leftInset,
    y + topInset,
    TILE - leftInset - rightInset,
    TILE - topInset - bottomInset,
  );

  ctx.fillStyle = border;
  if (!sameUp) ctx.fillRect(x + leftInset, y + 2, TILE - leftInset - rightInset, 3);
  if (!sameDown) ctx.fillRect(x + leftInset, y + TILE - 5, TILE - leftInset - rightInset, 3);
  if (!sameLeft) ctx.fillRect(x + 2, y + topInset, 3, TILE - topInset - bottomInset);
  if (!sameRight) ctx.fillRect(x + TILE - 5, y + topInset, 3, TILE - topInset - bottomInset);
}

function drawInteriorExit(x, y) {
  ctx.fillStyle = "#2b2020";
  ctx.fillRect(x + 5, y + 3, TILE - 10, TILE - 3);
  ctx.fillStyle = "#7a5130";
  ctx.fillRect(x + 9, y + 5, TILE - 18, TILE - 5);
  ctx.fillStyle = "#c79c55";
  ctx.fillRect(x + TILE - 13, y + 17, 3, 3);
}

function drawGrass(x, y, tx, ty) {
  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = seeded(tx, ty) > 0.5 ? COLORS.grassLight : COLORS.grassDark;
  if (seeded(tx + 9, ty + 4) > 0.46) ctx.fillRect(x + 6, y + 9, 3, 2);
  if (seeded(tx + 2, ty + 8) > 0.58) ctx.fillRect(x + 20, y + 22, 4, 2);
}

function drawPath(x, y, tx, ty) {
  ctx.fillStyle = COLORS.path;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = COLORS.pathDark;
  if (seeded(tx, ty) > 0.54) ctx.fillRect(x + 6, y + 8, 3, 3);
  if (seeded(tx + 3, ty + 11) > 0.6) ctx.fillRect(x + 22, y + 21, 4, 3);
}

function drawSand(x, y, tx, ty) {
  ctx.fillStyle = COLORS.sand;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = COLORS.sandDark;
  if (seeded(tx, ty) > 0.45) ctx.fillRect(x + 8, y + 12, 10, 2);
  if (seeded(tx + 5, ty + 2) > 0.62) ctx.fillRect(x + 20, y + 23, 6, 2);
}

function drawWater(x, y, tx, ty) {
  ctx.fillStyle = COLORS.water;
  ctx.fillRect(x, y, TILE, TILE);
  const waveOffset = Math.floor((performance.now() / 260 + tx * 3 + ty) % 16);
  ctx.fillStyle = COLORS.waterLight;
  ctx.fillRect(x + waveOffset - 8, y + 10, 14, 3);
  ctx.fillRect(x + ((waveOffset + 11) % 20) - 4, y + 23, 12, 3);
  ctx.fillStyle = COLORS.waterDark;
  ctx.fillRect(x, y + TILE - 3, TILE, 3);
}

function drawStone(x, y, tx, ty) {
  ctx.fillStyle = COLORS.stone;
  ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = COLORS.stoneDark;
  ctx.fillRect(x, y + 22, TILE, 10);
  ctx.fillStyle = "#aeb7bf";
  if (seeded(tx, ty) > 0.35) ctx.fillRect(x + 6, y + 6, 8, 4);
  if (seeded(tx + 4, ty + 5) > 0.62) ctx.fillRect(x + 20, y + 13, 7, 4);
}

function drawHedge(x, y, tx, ty) {
  ctx.fillStyle = COLORS.hedgeDark;
  ctx.fillRect(x + 2, y + 10, TILE - 4, 18);
  ctx.fillStyle = COLORS.hedge;
  ctx.fillRect(x + 4, y + 4, TILE - 8, 18);
  ctx.fillStyle = "#65b45d";
  if (seeded(tx, ty) > 0.5) ctx.fillRect(x + 9, y + 7, 6, 4);
  if (seeded(tx + 7, ty + 1) > 0.45) ctx.fillRect(x + 20, y + 13, 5, 4);
}

function drawTreeTile(x, y, tx, ty) {
  ctx.fillStyle = COLORS.trunk;
  ctx.fillRect(x + 13, y + 18, 7, 11);
  ctx.fillStyle = "#2f723b";
  ctx.fillRect(x + 7, y + 7, 20, 16);
  ctx.fillStyle = "#4e9f4a";
  ctx.fillRect(x + 5, y + 10, 24, 9);
  ctx.fillRect(x + 10, y + 3, 14, 9);
  ctx.fillStyle = "#78bd61";
  if (seeded(tx, ty) > 0.4) ctx.fillRect(x + 12, y + 6, 5, 4);
}

function drawFlowers(x, y, tx, ty) {
  const colors = ["#f1e35f", "#e9728d", "#ffffff"];
  for (let i = 0; i < 4; i += 1) {
    const px = x + 6 + ((tx * 11 + ty * 7 + i * 9) % 20);
    const py = y + 8 + ((tx * 5 + ty * 13 + i * 6) % 18);
    ctx.fillStyle = colors[(tx + ty + i) % colors.length];
    ctx.fillRect(px, py, 3, 3);
    ctx.fillStyle = COLORS.grassDark;
    ctx.fillRect(px + 1, py + 3, 1, 3);
  }
}

function drawTallGrass(x, y, tx, ty) {
  const colors = ["#4f8d3f", "#5fa24b", "#77b65b"];
  for (let i = 0; i < 9; i += 1) {
    const px = x + 3 + ((tx * 7 + ty * 11 + i * 5) % 25);
    const py = y + 8 + ((tx * 13 + ty * 3 + i * 7) % 18);
    ctx.fillStyle = colors[(tx + ty + i) % colors.length];
    ctx.fillRect(px, py, 3, 9);
    ctx.fillRect(px - 1, py + 4, 5, 2);
  }
}

function drawLedge(x, y) {
  ctx.fillStyle = "#b07845";
  ctx.fillRect(x, y + 8, TILE, 13);
  ctx.fillStyle = "#d3a061";
  ctx.fillRect(x, y + 6, TILE, 5);
  ctx.fillStyle = "#6d4f32";
  ctx.fillRect(x, y + 20, TILE, 5);
}
