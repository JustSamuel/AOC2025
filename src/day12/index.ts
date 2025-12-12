import run from "aocrunner";

type Region = { width: number; height: number; presents: number[] };

const parseInput = (
  rawInput: string,
): { boxW: number; boxH: number; regions: Region[] } => {
  const lines = rawInput.trim().split("\n");
  const shapes: string[][] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }
    if (/^\d+:$/.test(line)) {
      i++;
      const rows: string[] = [];
      while (i < lines.length && lines[i].trim() && /^[.#]+$/.test(lines[i])) {
        rows.push(lines[i].trim());
        i++;
      }
      shapes.push(rows);
    } else {
      break;
    }
  }

  const boxW = Math.max(...shapes[0].map((r) => r.length));
  const boxH = shapes[0].length;

  const regions: Region[] = [];
  while (i < lines.length) {
    const line = lines[i].trim();
    i++;
    if (!line) continue;
    const [dims, countsStr] = line.split(":");
    const [width, height] = dims.split("x").map(Number);
    const presents = countsStr.trim().split(/\s+/).map(Number);
    regions.push({ width, height, presents });
  }

  return { boxW, boxH, regions };
};

const part1 = (rawInput: string) => {
  const { boxW, boxH, regions } = parseInput(rawInput);

  let fitCount = 0;
  for (const region of regions) {
    const totalPresents = region.presents.reduce((a, b) => a + b, 0);
    const capacity =
      Math.floor(region.width / boxW) * Math.floor(region.height / boxH);
    if (totalPresents <= capacity) fitCount++;
  }
  return fitCount;
};

run({
  part1: {
    tests: [
      {
        input: `0:
###
##.
##.

1:
###
##.
.##

2:
.##
###
##.

3:
##.
###
##.

4:
###
#..
###

5:
###
.#.
###

4x4: 0 0 0 0 2 0
12x5: 1 0 1 0 2 2
12x5: 1 0 1 0 3 2`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: () => "",
  },
  trimTestInputs: true,
  onlyTests: false,
});
