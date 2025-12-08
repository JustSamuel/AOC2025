import run from "aocrunner";
import { DSU } from "../utils";

type Pt = { x: number; y: number; z: number };
const parseInput = (raw: string) => {
  const pts = raw
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.split(",").map(Number))
    .map(([x, y, z]) => ({ x, y, z } as Pt));

  const n = pts.length;
  const edges: { i: number; j: number; d: number }[] = [];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      edges.push({ i, j, d: dist(pts[i], pts[j]) });
    }
  }

  edges.sort((a, b) => a.d - b.d);

  return {
    points: pts,
    edges,
    n,
  };
};

const dist = (a: Pt, b: Pt) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
};

const part1 = (rawInput: string) => {
  const { edges, n } = parseInput(rawInput);

  const limit = edges.length >= 1000 ? 1000 : Math.min(10, edges.length);
  const dsu = new DSU(n);

  for (let k = 0; k < limit; k++) {
    dsu.union(edges[k].i, edges[k].j);
  }

  const sizes = dsu.getSize().sort((a, b) => b - a);
  return sizes[0] * sizes[1] * sizes[2];
};

const part2 = (rawInput: string) => {
  const { edges, n, points } = parseInput(rawInput);
  const dsu = new DSU(n);
  let unions = 0;

  for (const e of edges) {
    const merged = dsu.union(e.i, e.j);
    if (merged) {
      unions++;
      if (unions === n - 1) {
        return points[e.i].x * points[e.j].x;
      }
    }
  }
};

run({
  part1: {
    tests: [
      {
        input: `
162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689
        `,
        expected: 40,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
      162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`,
        expected: 25272,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
