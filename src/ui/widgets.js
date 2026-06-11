window.KA = window.KA || {};

function drawDrillPulse(x, y) {
  if (Math.floor(performance.now() / 320) % 2 !== 0) return;
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(x, y + 5, 10, 4);
  ctx.fillRect(x + 4, y + 9, 6, 4);
  ctx.fillRect(x + 7, y + 13, 3, 4);
}

function drawUiBox(x, y, w, h) {
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = COLORS.panel;
  ctx.fillRect(x + 5, y + 5, w - 10, h - 10);
  ctx.fillStyle = COLORS.panelAccent;
  ctx.fillRect(x + 10, y + 10, w - 20, 5);
  ctx.fillStyle = COLORS.panelLine;
  ctx.fillRect(x + 10, y + h - 15, w - 20, 3);
}

function drawMenuCursor(x, y, active) {
  if (!active) return;
  ctx.fillStyle = COLORS.black;
  ctx.fillRect(x, y + 5, 10, 4);
  ctx.fillRect(x + 4, y + 9, 6, 4);
  ctx.fillRect(x + 7, y + 13, 3, 4);
}

function drawFittedText(text, x, y, maxWidth, fontSize, bold) {
  let size = fontSize;
  const weight = bold ? "bold " : "";
  ctx.fillStyle = COLORS.text;
  ctx.textBaseline = "top";

  do {
    ctx.font = `${weight}${size}px ${UI_FONT}`;
    if (ctx.measureText(text).width <= maxWidth || size <= 9) break;
    size -= 1;
  } while (size > 9);

  ctx.fillText(text, x, y);
}

function drawCenteredFittedText(text, centerX, y, maxWidth, fontSize, bold) {
  let size = fontSize;
  const weight = bold ? "bold " : "";
  ctx.fillStyle = COLORS.text;
  ctx.textBaseline = "top";
  ctx.textAlign = "center";

  do {
    ctx.font = `${weight}${size}px ${UI_FONT}`;
    if (ctx.measureText(text).width <= maxWidth || size <= 9) break;
    size -= 1;
  } while (size > 9);

  ctx.fillText(text, centerX, y);
  ctx.textAlign = "left";
}

function wrapText(text, maxWidth, font) {
  ctx.font = font;
  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth) {
      line = testLine;
    } else {
      if (line) lines.push(line);
      if (ctx.measureText(word).width > maxWidth) {
        lines.push(...breakLongWord(word, maxWidth));
        line = "";
      } else {
        line = word;
      }
    }
  }

  if (line) lines.push(line);
  return lines;
}

function breakLongWord(word, maxWidth) {
  const pieces = [];
  let piece = "";
  for (const char of word) {
    const test = piece + char;
    if (ctx.measureText(test).width > maxWidth && piece) {
      pieces.push(piece);
      piece = char;
    } else {
      piece = test;
    }
  }
  if (piece) pieces.push(piece);
  return pieces;
}
