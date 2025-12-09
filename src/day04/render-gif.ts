import { readFileSync, writeFileSync, mkdirSync } from "fs";
import {
  CompassVectors,
  gridForEachCell,
  gridInGrid,
  gridParse,
} from "../utils/index.js";
// @ts-ignore - pngjs types may not be properly resolved
import { PNG } from "pngjs";

function findBails(grid: string[][]): Set<{ r: number; c: number }> {
  const rolls = new Set<{ r: number; c: number }>();
  gridForEachCell(grid, (row, column, value) => {
    if (value === ".") return;
    let count = 0;

    for (const [dr, dc] of CompassVectors) {
      const nr = row + dr;
      const nc = column + dc;
      if (!gridInGrid(grid, nr, nc)) continue;
      if (grid[nr][nc] === "@") count++;
    }

    if (count < 4) {
      rolls.add({ r: row, c: column });
    }
  });

  return rolls;
}

const CELL_SIZE = 10;
const CELL_PADDING = 1;
const GRID_PADDING = 20;
const HEADER_HEIGHT = 0;

const hexToRgb = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
};

const createFrame = (
  grid: string[][],
  iteration: number,
  totalRemoved: number,
  toRemove: Set<{ r: number; c: number }>,
): PNG => {
  const cols = grid[0].length;
  const rows = grid.length;
  const cellWithPadding = CELL_SIZE + CELL_PADDING;
  const gridWidth = cols * cellWithPadding - CELL_PADDING;
  const gridHeight = rows * cellWithPadding - CELL_PADDING;
  const width = gridWidth + GRID_PADDING * 2;
  const height = gridHeight + GRID_PADDING * 2 + HEADER_HEIGHT;

  const png = new PNG({ width, height });

  // Fill background (darker)
  const bgColor = hexToRgb("#050505");
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    png.data[idx] = bgColor[0];
    png.data[idx + 1] = bgColor[1];
    png.data[idx + 2] = bgColor[2];
    png.data[idx + 3] = 255;
  }

  // Create remove map
  const removeMap = new Map<string, boolean>();
  for (const { r, c } of toRemove) {
    removeMap.set(`${r},${c}`, true);
  }

  // Draw border (less saturated cyan)
  const borderColor = hexToRgb("#4488aa");
  const gridStartX = GRID_PADDING;
  const gridStartY = HEADER_HEIGHT;
  const gridEndX = gridStartX + gridWidth;
  const gridEndY = gridStartY + gridHeight;

  for (let x = gridStartX; x < gridEndX; x++) {
    setPixel(png.data, width, x, gridStartY, borderColor);
    setPixel(png.data, width, x, gridEndY - 1, borderColor);
  }
  for (let y = gridStartY; y < gridEndY; y++) {
    setPixel(png.data, width, gridStartX, y, borderColor);
    setPixel(png.data, width, gridEndX - 1, y, borderColor);
  }

  // Draw grid cells with padding
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      const willRemove = removeMap.has(`${r},${c}`);
      const x = GRID_PADDING + c * cellWithPadding;
      const y = HEADER_HEIGHT + r * cellWithPadding;

      let cellColor: [number, number, number];

      if (willRemove) {
        cellColor = hexToRgb("#cc4444"); // Less saturated red
      } else if (cell === "@") {
        cellColor = hexToRgb("#44aa44"); // Less saturated green
      } else if (cell === ".") {
        cellColor = hexToRgb("#333333"); // Darker gray
      } else {
        cellColor = hexToRgb("#aaaa44"); // Less saturated yellow
      }

      // Fill cell (with padding effect - leave border pixels as background)
      for (let dy = 0; dy < CELL_SIZE; dy++) {
        for (let dx = 0; dx < CELL_SIZE; dx++) {
          setPixel(png.data, width, x + dx, y + dy, cellColor);
        }
      }
    }
  }

  return png;
};

const setPixel = (
  data: Buffer,
  width: number,
  x: number,
  y: number,
  color: [number, number, number],
) => {
  const idx = (y * width + x) * 4;
  data[idx] = color[0];
  data[idx + 1] = color[1];
  data[idx + 2] = color[2];
  data[idx + 3] = 255;
};

const renderGif = async (rawInput: string, outputPath: string) => {
  const grid = gridParse(rawInput);
  const cols = grid[0].length;
  const rows = grid.length;
  const cellWithPadding = CELL_SIZE + CELL_PADDING;
  const gridWidth = cols * cellWithPadding - CELL_PADDING;
  const gridHeight = rows * cellWithPadding - CELL_PADDING;
  const width = gridWidth + GRID_PADDING * 2;
  const height = gridHeight + GRID_PADDING * 2 + HEADER_HEIGHT;

  const framesDir = "./day04-frames";
  try {
    mkdirSync(framesDir, { recursive: true });
  } catch {
    // Directory might already exist
  }

  const frames: string[] = [];
  let total = 0;
  let iteration = 0;
  let toRemove = findBails(grid);
  let frameNum = 0;

  // Initial frame
  const initialFrame = createFrame(grid, iteration, total, toRemove);
  const initialPath = `${framesDir}/frame-${String(frameNum++).padStart(
    4,
    "0",
  )}.png`;
  writeFileSync(initialPath, PNG.sync.write(initialFrame));
  frames.push(initialPath);

  while (toRemove.size > 0) {
    iteration++;

    // Frame showing what will be removed
    const beforeFrame = createFrame(grid, iteration, total, toRemove);
    const beforePath = `${framesDir}/frame-${String(frameNum++).padStart(
      4,
      "0",
    )}.png`;
    writeFileSync(beforePath, PNG.sync.write(beforeFrame));
    frames.push(beforePath);

    // Remove all cells
    total += toRemove.size;
    for (const { r, c } of toRemove) {
      grid[r][c] = ".";
    }

    // Frame after removal
    const afterFrame = createFrame(grid, iteration, total, toRemove);
    const afterPath = `${framesDir}/frame-${String(frameNum++).padStart(
      4,
      "0",
    )}.png`;
    writeFileSync(afterPath, PNG.sync.write(afterFrame));
    frames.push(afterPath);

    // Find next batch
    toRemove = findBails(grid);
  }

  // Final frame
  const finalFrame = createFrame(grid, iteration, total, toRemove);
  const finalPath = `${framesDir}/frame-${String(frameNum++).padStart(
    4,
    "0",
  )}.png`;
  writeFileSync(finalPath, PNG.sync.write(finalFrame));
  frames.push(finalPath);

  console.log(`Created ${frames.length} frames in ${framesDir}/`);
  console.log(`Total cells removed: ${total}`);
  console.log(`Iterations: ${iteration}`);
  console.log(`\nTo create GIF, use ImageMagick:`);
  console.log(
    `magick convert -delay 50 -loop 0 ${framesDir}/frame-*.png ${outputPath}`,
  );
  console.log(`\nOr use ffmpeg:`);
  console.log(
    `ffmpeg -framerate 2 -i ${framesDir}/frame-%04d.png ${outputPath}`,
  );
};

// Read input file
let rawInput: string | null = null;
try {
  rawInput = readFileSync("./src/day04/input.txt", "utf8");
} catch {
  console.error("Error: Could not find input.txt file");
  process.exit(1);
}

const outputPath = process.argv[2] || "./day04-animation.gif";
renderGif(rawInput, outputPath).catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
