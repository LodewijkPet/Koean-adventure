window.KA = window.KA || {};

function drawOutdoorObjects(scene) {
  const objects = [...(scene.objects || [])].sort(
    (a, b) => a.y + a.h - (b.y + b.h) || a.x - b.x,
  );

  for (const object of objects) {
    drawOutdoorObject(object);
  }
}

function drawOutdoorObject(object) {
  const x = Math.floor(object.x * TILE - cameraX);
  const y = Math.floor(object.y * TILE - cameraY);
  const w = object.w * TILE;
  const h = object.h * TILE;

  if (x + w < 0 || y + h < 0 || x > window.innerWidth || y > window.innerHeight) return;

  if (object.type === "trailBridge") {
    drawTrailBridgeObject(x, y, w, h);
    return;
  }

  if (object.type === "trailGate") {
    drawTrailGateObject(x, y, w, h);
    return;
  }

  if (object.type === "trailRestTable") {
    drawTrailRestTableObject(x, y, w, h);
    return;
  }

  if (object.type === "soundFountain") {
    drawSoundFountainObject(x, y, w, h);
    return;
  }

  if (object.type === "speechBench") {
    drawSpeechBenchObject(x, y, w, h);
    return;
  }

  if (object.type === "routeObjectStall") {
    drawRouteObjectStallObject(x, y, w, h);
  }
}

function drawInteriorObjects(scene) {
  const objects = [...(scene.objects || [])].sort(
    (a, b) => a.y + a.h - (b.y + b.h) || a.x - b.x,
  );

  for (const object of objects) {
    drawFurnitureObject(object);
  }
}

function drawFurnitureObject(object) {
  const x = Math.floor(object.x * TILE - cameraX);
  const y = Math.floor(object.y * TILE - cameraY);
  const w = object.w * TILE;
  const h = object.h * TILE;

  if (x + w < 0 || y + h < 0 || x > window.innerWidth || y > window.innerHeight) return;

  if (object.type === "bed") {
    drawBedObject(x, y, w, h);
    return;
  }

  if (
    object.type === "table" ||
    object.type === "teaTable" ||
    object.type === "desk" ||
    object.type === "studentDesk" ||
    object.type === "teacherDesk"
  ) {
    drawTableObject(x, y, w, h, object.type);
    return;
  }

  if (object.type === "blackboard") {
    drawBlackboardObject(x, y, w, h);
    return;
  }

  if (object.type === "counter") {
    drawCounterObject(x, y, w, h);
    return;
  }

  if (object.type === "bookcase" || object.type === "brochureRack") {
    drawRackObject(x, y, w, h, object.type);
    return;
  }

  if (object.type === "mapBoard") {
    drawMapBoardObject(x, y, w, h);
    return;
  }

  for (let yy = 0; yy < object.h; yy += 1) {
    for (let xx = 0; xx < object.w; xx += 1) {
      drawFurnitureTile(
        x + xx * TILE,
        y + yy * TILE,
        object.type,
        object.x + xx,
        object.y + yy,
      );
    }
  }
}

function drawObjectShadow(x, y, w, h) {
  ctx.fillStyle = "rgba(36, 25, 18, 0.22)";
  ctx.fillRect(x + 4, y + h - 6, w - 8, 4);
}

function drawBedObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#87543f";
  ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
  ctx.fillStyle = "#5f392d";
  ctx.fillRect(x + 4, y + 4, w - 8, 8);
  ctx.fillStyle = "#f4e4c5";
  ctx.fillRect(x + 10, y + 11, w - 20, Math.max(10, Math.floor(h * 0.22)));
  ctx.fillStyle = "#6f90b9";
  ctx.fillRect(x + 10, y + Math.floor(h * 0.36), w - 20, h - Math.floor(h * 0.48));
  ctx.fillStyle = "#55789f";
  ctx.fillRect(x + 10, y + h - 18, w - 20, 6);
}

function drawTableObject(x, y, w, h, type) {
  drawObjectShadow(x, y, w, h);
  const topHeight = Math.max(8, Math.min(18, Math.floor(h * 0.34)));
  const bodyColor = type === "teaTable" ? "#7d5736" : type === "studentDesk" ? "#765432" : "#805535";
  const topColor =
    type === "desk" || type === "studentDesk" || type === "teacherDesk" ? "#c6975f" : "#b8804d";

  ctx.fillStyle = bodyColor;
  ctx.fillRect(x + 6, y + topHeight + 5, w - 12, h - topHeight - 11);
  ctx.fillStyle = topColor;
  ctx.fillRect(x + 4, y + 5, w - 8, topHeight);
  ctx.fillStyle = "rgba(255, 236, 190, 0.35)";
  ctx.fillRect(x + 7, y + 7, w - 14, 3);
  ctx.fillStyle = "#4b3322";
  ctx.fillRect(x + 8, y + h - 10, 5, 7);
  ctx.fillRect(x + w - 13, y + h - 10, 5, 7);

  if (w > TILE) {
    ctx.fillRect(x + Math.floor(w / 2) - 2, y + h - 9, 4, 6);
  }

  if (type === "desk" || type === "studentDesk" || type === "teacherDesk") {
    ctx.fillStyle = "#f0e6bf";
    ctx.fillRect(x + 11, y + 8, Math.min(22, w - 22), 5);
    ctx.fillStyle = "#6d4e35";
    ctx.fillRect(x + w - 24, y + 9, 13, 3);
  }

  if (type === "studentDesk") {
    ctx.fillStyle = "#4d7fab";
    ctx.fillRect(x + w - 35, y + 8, 18, 7);
    ctx.fillStyle = "#f4d36b";
    ctx.fillRect(x + w - 32, y + 10, 12, 2);
  }

  if (type === "teacherDesk") {
    ctx.fillStyle = "#9b5f42";
    ctx.fillRect(x + w - 35, y + 8, 12, 8);
    ctx.fillStyle = "#f0e6bf";
    ctx.fillRect(x + 38, y + 8, 28, 6);
  }
}

function drawBlackboardObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#5c412c";
  ctx.fillRect(x + 3, y + 5, w - 6, h - 8);
  ctx.fillStyle = "#244d3a";
  ctx.fillRect(x + 7, y + 8, w - 14, h - 16);
  ctx.fillStyle = "#dfe8d8";
  ctx.font = `14px ${UI_FONT}`;
  ctx.textBaseline = "top";
  ctx.fillText("ㄱ + ㅏ", x + 14, y + 11);
  ctx.fillStyle = "#e6d9b6";
  ctx.fillRect(x + w - 42, y + h - 10, 28, 3);
}

function drawCounterObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#6f4b2d";
  ctx.fillRect(x + 2, y + 7, w - 4, h - 8);
  ctx.fillStyle = "#c49352";
  ctx.fillRect(x + 2, y + 4, w - 4, 8);
  ctx.fillStyle = "rgba(255, 232, 176, 0.38)";
  ctx.fillRect(x + 6, y + 6, w - 12, 2);
  ctx.fillStyle = "#4a3322";
  ctx.fillRect(x + 5, y + h - 9, w - 10, 5);

  for (let xx = x + TILE; xx < x + w - 4; xx += TILE) {
    ctx.fillStyle = "rgba(52, 34, 22, 0.35)";
    ctx.fillRect(xx - 1, y + 12, 2, h - 21);
  }
}

function drawRackObject(x, y, w, h, type) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#6f4d35";
  ctx.fillRect(x + 5, y + 3, w - 10, h - 6);
  ctx.fillStyle = "#4e3526";
  ctx.fillRect(x + 5, y + 3, w - 10, 5);

  for (let shelfY = y + 14; shelfY < y + h - 4; shelfY += 12) {
    ctx.fillStyle = "#b78550";
    ctx.fillRect(x + 7, shelfY, w - 14, 3);
  }

  const colors = type === "bookcase" ? ["#b54848", "#4d7fab", "#d6bd57"] : ["#f0e6bf", "#68a7bd", "#d28a58"];
  let slot = 0;
  for (let shelfY = y + 7; shelfY < y + h - 13; shelfY += 12) {
    for (let bookX = x + 9; bookX < x + w - 10; bookX += 7) {
      ctx.fillStyle = colors[slot % colors.length];
      ctx.fillRect(bookX, shelfY, 4, 8);
      slot += 1;
    }
  }
}

function drawMapBoardObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#544234";
  ctx.fillRect(x + 3, y + 5, w - 6, h - 10);
  ctx.fillStyle = "#d7c28a";
  ctx.fillRect(x + 7, y + 8, w - 14, h - 16);
  ctx.fillStyle = "#6fa05a";
  ctx.fillRect(x + 12, y + 12, Math.max(12, Math.floor(w * 0.22)), Math.max(5, h - 24));
  ctx.fillStyle = "#4a7fb0";
  ctx.fillRect(x + Math.floor(w * 0.58), y + 14, Math.max(12, Math.floor(w * 0.18)), 5);
  ctx.fillStyle = "#b46b4c";
  ctx.fillRect(x + Math.floor(w * 0.34), y + 18, Math.max(26, Math.floor(w * 0.3)), 3);
}

function drawFurnitureTile(x, y, type, tx, ty) {
  if (type === "bed") {
    ctx.fillStyle = "#87543f";
    ctx.fillRect(x + 4, y + 4, TILE - 8, TILE - 8);
    ctx.fillStyle = "#f4e4c5";
    ctx.fillRect(x + 7, y + 7, TILE - 14, 8);
    ctx.fillStyle = "#6f90b9";
    ctx.fillRect(x + 7, y + 16, TILE - 14, 9);
    return;
  }

  if (type === "table" || type === "teaTable" || type === "desk") {
    ctx.fillStyle = type === "teaTable" ? "#7d5736" : "#805535";
    ctx.fillRect(x + 5, y + 8, TILE - 10, 15);
    ctx.fillStyle = type === "desk" ? "#c6975f" : "#b8804d";
    ctx.fillRect(x + 4, y + 5, TILE - 8, 8);
    ctx.fillStyle = "#4b3322";
    ctx.fillRect(x + 8, y + 23, 4, 5);
    ctx.fillRect(x + TILE - 12, y + 23, 4, 5);
    if (type === "desk") {
      ctx.fillStyle = "#f0e6bf";
      ctx.fillRect(x + 9, y + 7, 11, 4);
    }
    return;
  }

  if (type === "chair" || type === "cushion") {
    ctx.fillStyle = type === "cushion" ? "#cf7967" : "#76512f";
    ctx.fillRect(x + 8, y + 12, TILE - 16, 13);
    ctx.fillStyle = type === "cushion" ? "#f0b3a3" : "#a97945";
    ctx.fillRect(x + 10, y + 10, TILE - 20, 6);
    return;
  }

  if (type === "tv") {
    ctx.fillStyle = "#303238";
    ctx.fillRect(x + 5, y + 8, TILE - 10, 16);
    ctx.fillStyle = "#7db5c9";
    ctx.fillRect(x + 8, y + 11, TILE - 16, 9);
    ctx.fillStyle = "#202124";
    ctx.fillRect(x + 12, y + 24, 8, 4);
    return;
  }

  if (type === "fridge" || type === "sink" || type === "stove") {
    ctx.fillStyle = type === "stove" ? "#2f3438" : "#e4e7df";
    ctx.fillRect(x + 6, y + 4, TILE - 12, TILE - 7);
    ctx.fillStyle = "#9aa8b6";
    ctx.fillRect(x + 8, y + 8, TILE - 16, 4);
    if (type === "sink") {
      ctx.fillStyle = "#6fb8d0";
      ctx.fillRect(x + 10, y + 15, TILE - 20, 8);
    }
    if (type === "stove") {
      ctx.fillStyle = "#d0d4d7";
      ctx.fillRect(x + 9, y + 10, 5, 5);
      ctx.fillRect(x + 18, y + 10, 5, 5);
      ctx.fillRect(x + 9, y + 20, 14, 3);
    }
    return;
  }

  if (type === "counter") {
    ctx.fillStyle = "#6f4b2d";
    ctx.fillRect(x + 2, y + 6, TILE - 4, 19);
    ctx.fillStyle = "#c49352";
    ctx.fillRect(x + 2, y + 4, TILE - 4, 6);
    ctx.fillStyle = "#4a3322";
    ctx.fillRect(x + 5, y + 23, TILE - 10, 4);
    return;
  }

  if (type === "produce" || type === "fish" || type === "supplyShelf") {
    ctx.fillStyle = "#76512e";
    ctx.fillRect(x + 4, y + 5, TILE - 8, 22);
    ctx.fillStyle = "#a57542";
    ctx.fillRect(x + 5, y + 10, TILE - 10, 3);
    ctx.fillRect(x + 5, y + 20, TILE - 10, 3);
    const itemColors =
      type === "produce"
        ? ["#5ca354", "#d06d4d", "#e0c34d"]
        : type === "fish"
          ? ["#88c5d6", "#eef2f1", "#5a8ca2"]
          : ["#d9c17a", "#8eb1c9", "#c7836a"];
    for (let i = 0; i < 5; i += 1) {
      ctx.fillStyle = itemColors[(tx + ty + i) % itemColors.length];
      ctx.fillRect(x + 7 + (i % 3) * 7, y + 13 + Math.floor(i / 3) * 9, 5, 5);
    }
    return;
  }

  if (type === "bookcase" || type === "brochureRack") {
    ctx.fillStyle = "#6f4d35";
    ctx.fillRect(x + 5, y + 3, TILE - 10, TILE - 6);
    ctx.fillStyle = "#b78550";
    ctx.fillRect(x + 7, y + 12, TILE - 14, 3);
    ctx.fillRect(x + 7, y + 22, TILE - 14, 3);
    const colors = type === "bookcase" ? ["#b54848", "#4d7fab", "#d6bd57"] : ["#f0e6bf", "#68a7bd", "#d28a58"];
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = colors[(tx + i) % colors.length];
      ctx.fillRect(x + 8 + i * 5, y + 6, 3, 6);
    }
    return;
  }

  if (type === "mapBoard") {
    ctx.fillStyle = "#544234";
    ctx.fillRect(x + 3, y + 5, TILE - 6, TILE - 10);
    ctx.fillStyle = "#d7c28a";
    ctx.fillRect(x + 6, y + 8, TILE - 12, TILE - 16);
    ctx.fillStyle = "#6fa05a";
    ctx.fillRect(x + 9, y + 12, 7, 5);
    ctx.fillStyle = "#4a7fb0";
    ctx.fillRect(x + 18, y + 16, 6, 4);
  }
}

function drawTrailBridgeObject(x, y, w, h) {
  ctx.fillStyle = "#6e4b2d";
  ctx.fillRect(x + 8, y + 6, w - 16, h - 12);
  ctx.fillStyle = "#b9844e";
  ctx.fillRect(x + 12, y + 10, w - 24, h - 20);

  ctx.fillStyle = "#855a34";
  for (let yy = y + 14; yy < y + h - 12; yy += 10) {
    ctx.fillRect(x + 12, yy, w - 24, 2);
  }
  for (let xx = x + TILE; xx < x + w - TILE / 2; xx += TILE) {
    ctx.fillRect(xx, y + 10, 2, h - 20);
  }

  ctx.fillStyle = "#4b3322";
  ctx.fillRect(x + 14, y + 4, 5, h - 8);
  ctx.fillRect(x + w - 19, y + 4, 5, h - 8);
  ctx.fillRect(x + 6, y + 8, w - 12, 4);
  ctx.fillRect(x + 6, y + h - 12, w - 12, 4);
}

function drawTrailGateObject(x, y, w, h) {
  ctx.fillStyle = "#5f5a4c";
  ctx.fillRect(x + 7, y + 7, 18, h - 4);
  ctx.fillRect(x + w - 25, y + 7, 18, h - 4);
  ctx.fillStyle = "#9a927b";
  ctx.fillRect(x + 10, y + 4, 12, 9);
  ctx.fillRect(x + w - 22, y + 4, 12, 9);

  ctx.fillStyle = "#6b4b2f";
  ctx.fillRect(x + 20, y + 12, w - 40, 9);
  ctx.fillStyle = "#b9844e";
  ctx.fillRect(x + 25, y + 14, w - 50, 4);
}

function drawTrailRestTableObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#6f4b2d";
  ctx.fillRect(x + 7, y + 13, w - 14, h - 22);
  ctx.fillStyle = "#b9844e";
  ctx.fillRect(x + 5, y + 8, w - 10, 20);
  ctx.fillStyle = "rgba(255, 236, 190, 0.34)";
  ctx.fillRect(x + 10, y + 11, w - 20, 3);

  ctx.fillStyle = "#f0e6bf";
  ctx.fillRect(x + 15, y + 13, 30, 10);
  ctx.fillStyle = "#687c58";
  ctx.fillRect(x + 18, y + 16, 24, 2);
  ctx.fillRect(x + 18, y + 20, 18, 2);

  ctx.fillStyle = "#4f8cc9";
  ctx.fillRect(x + w - 44, y + 12, 12, 15);
  ctx.fillStyle = "#9fd0e0";
  ctx.fillRect(x + w - 41, y + 14, 6, 4);

  ctx.fillStyle = "#f5edd1";
  ctx.fillRect(x + w - 25, y + 17, 7, 6);
  ctx.fillRect(x + w - 15, y + 17, 7, 6);
  ctx.fillStyle = "#4b3322";
  ctx.fillRect(x + 14, y + h - 15, 6, 11);
  ctx.fillRect(x + w - 20, y + h - 15, 6, 11);
}

function drawSoundFountainObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#68727c";
  ctx.fillRect(x + 12, y + 18, w - 24, h - 36);
  ctx.fillStyle = "#9aa5ad";
  ctx.fillRect(x + 8, y + 14, w - 16, 10);
  ctx.fillRect(x + 8, y + h - 24, w - 16, 10);
  ctx.fillRect(x + 8, y + 14, 10, h - 28);
  ctx.fillRect(x + w - 18, y + 14, 10, h - 28);

  ctx.fillStyle = "#4f9cc9";
  ctx.fillRect(x + 20, y + 26, w - 40, h - 52);
  ctx.fillStyle = "#8fd3e8";
  ctx.fillRect(x + 28, y + 32, w - 56, 4);
  ctx.fillRect(x + 34, y + 46, w - 68, 3);

  ctx.fillStyle = "#f2e8c6";
  ctx.fillRect(x + w / 2 - 8, y + 10, 16, 12);
  ctx.fillStyle = "#2f5874";
  ctx.fillRect(x + w / 2 - 2, y + 22, 4, 24);
}

function drawSpeechBenchObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#6f4b2d";
  ctx.fillRect(x + 6, y + 7, w - 12, 8);
  ctx.fillRect(x + 9, y + 18, w - 18, 7);
  ctx.fillStyle = "#b9844e";
  ctx.fillRect(x + 8, y + 5, w - 16, 4);
  ctx.fillRect(x + 11, y + 16, w - 22, 3);
  ctx.fillStyle = "#4b3322";
  ctx.fillRect(x + 16, y + 23, 5, 9);
  ctx.fillRect(x + w - 21, y + 23, 5, 9);
}

function drawRouteObjectStallObject(x, y, w, h) {
  drawObjectShadow(x, y, w, h);
  ctx.fillStyle = "#6f4b2d";
  ctx.fillRect(x + 5, y + 21, w - 10, h - 31);
  ctx.fillStyle = "#b9844e";
  ctx.fillRect(x + 3, y + 15, w - 6, 12);

  const items = [
    ["#f0e6bf", x + 12, y + 18, 14, 10],
    ["#4f8cc9", x + 36, y + 17, 11, 13],
    ["#b65c48", x + 58, y + 19, 14, 10],
  ];
  for (const [fill, ix, iy, iw, ih] of items) {
    ctx.fillStyle = fill;
    ctx.fillRect(ix, iy, iw, ih);
  }

  ctx.fillStyle = "#7d3137";
  ctx.fillRect(x + 5, y + 5, w - 10, 8);
  ctx.fillStyle = "#f5edd1";
  ctx.fillRect(x + 9, y + 7, w - 18, 3);
  ctx.fillStyle = "#4b3322";
  ctx.fillRect(x + 13, y + h - 14, 6, 10);
  ctx.fillRect(x + w - 19, y + h - 14, 6, 10);
}
