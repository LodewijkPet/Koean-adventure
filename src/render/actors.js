window.KA = window.KA || {};

function drawPlayer() {
  const x = Math.floor(player.px - cameraX);
  const y = Math.floor(player.py - cameraY);
  drawPerson(x, y, player.dir, {
    skin: "#b77955",
    hair: "#2a1f1d",
    hat: "#f4e6bd",
    jacket: "#d85d5d",
    pants: "#2f5f89",
    backpack: "#494e55",
    camera: true,
  });
}

function drawNpc(npc) {
  const x = Math.floor(npc.x * TILE - cameraX);
  const y = Math.floor(npc.y * TILE - cameraY);
  if (npc.kind === "child") {
    drawChild(x, y, npc.dir, {
      skin: "#bc7d58",
      hair: "#27211e",
      jacket: npc.jacket,
      pants: "#3e4a54",
    });
    return;
  }

  drawPerson(x, y, npc.dir, {
    skin: "#bc7d58",
    hair: "#27211e",
    hat: null,
    jacket: npc.jacket,
    pants: "#3e4a54",
    backpack: null,
    camera: false,
  });
}

function drawChild(x, y, dir, palette) {
  const childY = y + 5;
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(x + 9, childY + 22, 14, 4);

  ctx.fillStyle = palette.pants;
  ctx.fillRect(x + 10, childY + 18, 5, 7);
  ctx.fillRect(x + 17, childY + 18, 5, 7);
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(x + 9, childY + 24, 7, 3);
  ctx.fillRect(x + 16, childY + 24, 7, 3);

  ctx.fillStyle = palette.jacket;
  ctx.fillRect(x + 9, childY + 10, 14, 10);
  ctx.fillStyle = "#f0eee2";
  if (dir === "down") ctx.fillRect(x + 14, childY + 11, 4, 8);

  ctx.fillStyle = palette.skin;
  ctx.fillRect(x + 11, childY + 4, 10, 9);
  if (dir === "left") ctx.fillRect(x + 9, childY + 7, 3, 4);
  if (dir === "right") ctx.fillRect(x + 20, childY + 7, 3, 4);

  ctx.fillStyle = palette.hair;
  if (dir === "up") ctx.fillRect(x + 10, childY + 3, 12, 9);
  else ctx.fillRect(x + 10, childY + 3, 12, 5);

  ctx.fillStyle = COLORS.black;
  if (dir === "down") {
    ctx.fillRect(x + 13, childY + 9, 2, 2);
    ctx.fillRect(x + 18, childY + 9, 2, 2);
  } else if (dir === "left") {
    ctx.fillRect(x + 11, childY + 9, 2, 2);
  } else if (dir === "right") {
    ctx.fillRect(x + 20, childY + 9, 2, 2);
  }
}

function drawPerson(x, y, dir, palette) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  ctx.fillRect(x + 8, y + 25, 16, 5);

  const leftOffset = dir === "left" ? -2 : 0;
  const rightOffset = dir === "right" ? 2 : 0;

  if (palette.backpack && dir !== "down") {
    ctx.fillStyle = palette.backpack;
    ctx.fillRect(x + 8, y + 14, 16, 11);
  }

  ctx.fillStyle = palette.pants;
  ctx.fillRect(x + 9, y + 22, 5, 7);
  ctx.fillRect(x + 18, y + 22, 5, 7);
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(x + 8, y + 28, 7, 3);
  ctx.fillRect(x + 17, y + 28, 7, 3);

  ctx.fillStyle = palette.jacket;
  ctx.fillRect(x + 8 + leftOffset + rightOffset, y + 13, 16, 11);
  ctx.fillStyle = "#f0eee2";
  if (dir === "down") ctx.fillRect(x + 14, y + 14, 4, 9);
  if (dir === "left") ctx.fillRect(x + 9, y + 15, 4, 7);
  if (dir === "right") ctx.fillRect(x + 19, y + 15, 4, 7);

  ctx.fillStyle = palette.skin;
  ctx.fillRect(x + 10, y + 6, 12, 10);
  if (dir === "left") ctx.fillRect(x + 8, y + 9, 4, 5);
  if (dir === "right") ctx.fillRect(x + 20, y + 9, 4, 5);

  ctx.fillStyle = palette.hair;
  if (dir === "up") ctx.fillRect(x + 9, y + 5, 14, 10);
  else ctx.fillRect(x + 9, y + 5, 14, 5);

  if (palette.hat) {
    ctx.fillStyle = palette.hat;
    ctx.fillRect(x + 7, y + 3, 18, 5);
    ctx.fillRect(x + 10, y + 0, 12, 4);
    if (dir === "down") ctx.fillRect(x + 11, y + 8, 10, 2);
  }

  ctx.fillStyle = COLORS.black;
  if (dir === "down") {
    ctx.fillRect(x + 12, y + 11, 2, 2);
    ctx.fillRect(x + 18, y + 11, 2, 2);
  } else if (dir === "left") {
    ctx.fillRect(x + 10, y + 11, 2, 2);
  } else if (dir === "right") {
    ctx.fillRect(x + 20, y + 11, 2, 2);
  }

  if (palette.camera) {
    ctx.fillStyle = "#1b1b1f";
    ctx.fillRect(x + 21, y + 17, 6, 5);
    ctx.fillStyle = "#9aa8b6";
    ctx.fillRect(x + 23, y + 18, 2, 2);
  }
}
