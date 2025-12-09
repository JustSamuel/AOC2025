import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const lines = rawInput
    .trim()
    .split("\n")
    .map((line) => line.split(",").map(Number));
  return lines.map(([x, y]) => ({ x, y }));
};

const part1 = (rawInput: string) => {
  const points = parseInput(rawInput);

  let bestArea = 0;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const area =
        (Math.abs(points[i].x - points[j].x) + 1) *
        (Math.abs(points[i].y - points[j].y) + 1);
      if (area > bestArea) bestArea = area;
    }
  }
  return bestArea;
};

const part2 = (rawInput: string) => {
  const points = parseInput(rawInput);

  // compress
  const xs = Array.from(new Set(points.map((p) => p.x))).sort((a, b) => a - b);
  const ys = Array.from(new Set(points.map((p) => p.y))).sort((a, b) => a - b);
  const xm = new Map(xs.map((v, i) => [v, i]));
  const ym = new Map(ys.map((v, i) => [v, i]));

  const W = xs.length;
  const H = ys.length;

  // mark green
  const grid = Array.from({ length: W }, () => Array(H).fill(false));
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const x1 = xm.get(a.x)!;
    const x2 = xm.get(b.x)!;
    const y1 = ym.get(a.y)!;
    const y2 = ym.get(b.y)!;

    if (x1 === x2) {
      for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++)
        grid[x1][y] = true;
    } else {
      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
        grid[x][y1] = true;
    }
  }

  // flood fill
  const visited = Array.from({ length: W + 2 }, () => Array(H + 2).fill(false));
  const queue: [number, number][] = [[0, 0]];
  while (queue.length) {
    const [x, y] = queue.pop()!;
    if (x < 0 || y < 0 || x >= W + 2 || y >= H + 2) continue;
    if (visited[x][y]) continue;

    // use compressed
    const gx = x - 1;
    const gy = y - 1;
    if (gx >= 0 && gy >= 0 && gx < W && gy < H && grid[gx][gy]) continue;

    visited[x][y] = true;
    queue.push([x + 1, y]);
    queue.push([x - 1, y]);
    queue.push([x, y + 1]);
    queue.push([x, y - 1]);
  }

  // mark green
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      if (!visited[x + 1][y + 1]) grid[x][y] = true;
    }
  }

  // compote prefix sum
  const ps = Array.from({ length: W + 1 }, () => Array(H + 1).fill(0));
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      ps[x + 1][y + 1] =
        (grid[x][y] ? 1 : 0) + ps[x][y + 1] + ps[x + 1][y] - ps[x][y];
    }
  }

  // shorthand for prefix sum
  const sum = (x1: number, y1: number, x2: number, y2: number) =>
    ps[x2 + 1][y2 + 1] - ps[x1][y2 + 1] - ps[x2 + 1][y1] + ps[x1][y1];

  // get red tiles
  const red = points.map((p) => [xm.get(p.x)!, ym.get(p.y)!] as const);

  let max = 0;
  for (let i = 0; i < red.length; i++) {
    const [x1, y1] = red[i];
    for (let j = i + 1; j < red.length; j++) {
      const [x2, y2] = red[j];

      // for each pair of red tiles

      const xmin = Math.min(x1, x2);
      const xmax = Math.max(x1, x2);
      const ymin = Math.min(y1, y2);
      const ymax = Math.max(y1, y2);

      // compute area
      const size = (xmax - xmin + 1) * (ymax - ymin + 1);

      // check if area consist of only red/green tiles
      if (sum(xmin, ymin, xmax, ymax) === size) {
        // if so update max area
        const area = (xs[xmax] - xs[xmin] + 1) * (ys[ymax] - ys[ymin] + 1);
        max = Math.max(max, area);
      }
    }
  }

  return max;
};

run({
  part1: {
    tests: [
      {
        input: `
        7,1
        11,1
        11,7
        9,7
        9,5
        2,5
        2,3
        7,3
        `,
        expected: 50,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        7,1
        11,1
        11,7
        9,7
        9,5
        2,5
        2,3
        7,3
        `,
        expected: 24,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
