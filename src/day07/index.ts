import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.trim().split("\n");

const findStart = (grid: string[]) => {
  for (let r = 0; r < grid.length; r++) {
    const c = grid[r].indexOf("S");
    if (c !== -1) return { r, c };
  }
  return null;
};

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  const start = findStart(grid);
  if (!start) return 0;

  let beams = new Set([start.c]);
  let splits = 0;

  for (let r = start.r + 1; r < grid.length; r++) {
    const next = new Set<number>();
    for (const c of beams) {
      if (c < 0 || c >= grid[r].length) continue;
      if (grid[r][c] === "^") {
        splits++;
        if (c > 0) next.add(c - 1);
        if (c < grid[r].length - 1) next.add(c + 1);
      } else if (grid[r][c] === "." || grid[r][c] === "|") {
        next.add(c);
      }
    }
    beams = next;
    if (beams.size === 0) break;
  }

  return splits;
};

const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  const start = findStart(grid);
  if (!start) return 0;

  let counts = new Map<number, number>([[start.c, 1]]);

  for (let r = start.r + 1; r < grid.length; r++) {
    const next = new Map<number, number>();
    for (const [c, cnt] of counts) {
      if (c < 0 || c >= grid[r].length) continue;
      if (grid[r][c] === "^") {
        if (c > 0) next.set(c - 1, (next.get(c - 1) || 0) + cnt);
        if (c < grid[r].length - 1)
          next.set(c + 1, (next.get(c + 1) || 0) + cnt);
      } else if (grid[r][c] === "." || grid[r][c] === "|") {
        next.set(c, (next.get(c) || 0) + cnt);
      }
    }
    counts = next;
    if (counts.size === 0) break;
  }

  return [...counts.values()].reduce((a, b) => a + b, 0);
};

run({
  part1: {
    tests: [
      {
        input: `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`,
        expected: 40,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
