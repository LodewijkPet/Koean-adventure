window.KA = window.KA || {};

function drawBuilding(building) {
  const x = Math.floor(building.x * TILE - cameraX);
  const y = Math.floor(building.y * TILE - cameraY);
  const w = building.w * TILE;
  const h = building.h * TILE;

  if (x > window.innerWidth || y > window.innerHeight || x + w < 0 || y + h < 0) return;

  const roofHeight = building.important ? TILE * 2.4 : TILE * 2;
  const wallY = y + roofHeight - 5;
  const wallHeight = h - roofHeight + 5;

  ctx.fillStyle = "#58432d";
  ctx.fillRect(x + 6, y + 8, w - 12, roofHeight + 8);
  ctx.fillStyle = building.roof;
  ctx.fillRect(x + 2, y + 4, w - 4, roofHeight - 4);
  ctx.fillStyle = building.trim;
  ctx.fillRect(x + 2, y + roofHeight - 9, w - 4, 8);
  ctx.fillStyle = "#f3d56a";
  for (let tx = 0; tx < building.w; tx += 1) {
    if ((tx + building.x) % 2 === 0) ctx.fillRect(x + tx * TILE + 7, y + 12, 8, 6);
  }

  ctx.fillStyle = COLORS.wall;
  ctx.fillRect(x + 12, wallY, w - 24, wallHeight);
  ctx.fillStyle = COLORS.wallShadow;
  ctx.fillRect(x + 12, wallY + wallHeight - 8, w - 24, 8);
  ctx.fillStyle = "#7c6f57";
  ctx.fillRect(x + 12, wallY, w - 24, 4);

  const doorX = Math.floor(building.doorX * TILE - cameraX);
  const doorY = Math.floor(building.doorY * TILE - cameraY);
  ctx.fillStyle = COLORS.door;
  ctx.fillRect(doorX + 5, doorY + 4, TILE - 10, TILE - 4);
  ctx.fillStyle = "#c69b55";
  ctx.fillRect(doorX + TILE - 11, doorY + 17, 3, 3);

  const windowY = wallY + 17;
  const leftWindowX = x + 25;
  const rightWindowX = x + w - 50;
  drawWindow(leftWindowX, windowY);
  if (rightWindowX - leftWindowX > 45) drawWindow(rightWindowX, windowY);

  if (building.important) {
    ctx.fillStyle = "#2d2d2d";
    ctx.fillRect(x + w / 2 - 38, wallY + 2, 76, 13);
    ctx.fillStyle = "#f0eee2";
    ctx.fillRect(x + w / 2 - 32, wallY + 6, 64, 5);
  }
}

function drawWindow(x, y) {
  ctx.fillStyle = "#2c5575";
  ctx.fillRect(x, y, 24, 18);
  ctx.fillStyle = "#8fd0e8";
  ctx.fillRect(x + 4, y + 4, 16, 10);
  ctx.fillStyle = "#f8fff8";
  ctx.fillRect(x + 6, y + 4, 4, 10);
}

function drawInteractables() {
  for (const item of currentScene().interactables) {
    if (item.hidden) continue;
    if (item.kind === "sign") drawSign(item.x, item.y);
    if (item.kind === "route") drawRouteMarker(item.x, item.y);
    if (item.kind === "waterEdge") drawShoreMarker(item.x, item.y);
  }
}

function drawSign(tx, ty) {
  const x = Math.floor(tx * TILE - cameraX);
  const y = Math.floor(ty * TILE - cameraY);
  ctx.fillStyle = "#76512e";
  ctx.fillRect(x + 14, y + 17, 5, 13);
  ctx.fillStyle = "#d9bd7a";
  ctx.fillRect(x + 5, y + 7, 22, 14);
  ctx.fillStyle = "#8b6236";
  ctx.fillRect(x + 5, y + 18, 22, 3);
  ctx.fillStyle = "#5a3d25";
  ctx.fillRect(x + 9, y + 11, 14, 2);
  ctx.fillRect(x + 9, y + 15, 10, 2);
}

function drawRouteMarker(tx, ty) {
  const x = Math.floor(tx * TILE - cameraX);
  const y = Math.floor(ty * TILE - cameraY);
  ctx.fillStyle = "#d9bd7a";
  ctx.fillRect(x + 4, y + 2, TILE - 8, TILE - 4);
  ctx.fillStyle = COLORS.pathDark;
  ctx.fillRect(x + 11, y + 10, 10, 5);
  ctx.fillRect(x + 14, y + 7, 4, 12);
  ctx.fillStyle = COLORS.void;
  ctx.fillRect(x + 6, y, TILE - 12, 3);
}

function drawShoreMarker(tx, ty) {
  const x = Math.floor(tx * TILE - cameraX);
  const y = Math.floor(ty * TILE - cameraY);
  ctx.fillStyle = "#f5edd1";
  ctx.fillRect(x + 4, y + 10, 24, 4);
  ctx.fillRect(x + 10, y + 17, 18, 4);
}
