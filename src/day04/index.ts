import run from "aocrunner";
import {CompassVectors, gridForEachCell, gridInGrid, gridParse} from "../utils/index.js";

function findBails(grid: string[][]): Set<{ r: number; c: number }> {
  const rolls = new Set<{ r: number; c: number }>();
  gridForEachCell(grid, (row, column, value) => {
    if (value === ".") return;
    let count = 0;

    for (const [dr, dc] of CompassVectors) {
      const nr = row  + dr;
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

const part1 = (rawInput: string) => {
  const grid = gridParse(rawInput);
  return findBails(grid).size;
};


const part2 = (rawInput: string) => {
  const grid = gridParse(rawInput);
  let total = 0;
  let toRemove = findBails(grid);

  while (toRemove.size > 0) {
    total += toRemove.size;
    for (const { r, c } of toRemove) {
      grid[r][c] = ".";
    }
    toRemove = findBails(grid);
  }

  return total;
};

run({
  part1: {
    tests: [
      {
        input: `
        ..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.
        `,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        ..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.        
        `,
        expected: 43,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
