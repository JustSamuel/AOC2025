import run from "aocrunner";

const parseInput = (raw: string) => {
  const lines = raw.trim().split("\n");
  return lines.map((line) => {
    return { dir: line[0], n: Number(line.slice(1)) };
  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let dial = 50;
  let count = 0;
  for (const { dir, n } of input) {
    if (dir === "L") dial -= n;
    else dial += n;
    dial = (dial + 100) % 100;
    if (dial === 0) count++;
  }
  return count;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let dial = 50;
  let count = 0;
  for (const { dir, n } of input) {
    for (let i = 0; i < n; i++) {
      if (dir === "L") dial--;
      else dial++;
      dial = (dial + 100) % 100;
      if (dial === 0) count++;
    }
  }
  return count;
};

run({
  part1: {
    tests: [
      {
        input: `
        L68
L30
R48
L5
R60
L55
L1
L99
R14
L82
`,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
                L68
L30
R48
L5
R60
L55
L1
L99
R14
L82
        `,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
