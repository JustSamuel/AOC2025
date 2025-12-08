import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput
    .trim()
    .split("\n")
    .map((line) => line.split("").map(Number));
};

const findMax = (bank: number[], batteryCount: number): number => {
  const n = bank.length;
  const k = batteryCount;
  const selected: number[] = [];
  let start = 0;

  for (let pos = 0; pos < k; pos++) {
    const remaining = k - pos - 1;
    const end = n - remaining;
    const slice = bank.slice(start, end);

    const digit = Math.max(...slice);
    const index = start + slice.indexOf(digit);

    selected.push(digit);
    start = index + 1;
  }

  return Number(selected.join(""));
};

const solver = (banks: number[][], batteryCount: number) => {
  let sum = 0;

  for (const bank of banks) {
    sum += findMax(bank, batteryCount);
  }

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
987654321111111
811111111111119
234234234234278
818181911112111
        `,
        expected: 357,
      },
    ],
    solution: (rawInput: string) => solver(parseInput(rawInput), 2),
  },
  part2: {
    tests: [
      {
        input: `
        987654321111111
811111111111119
234234234234278
818181911112111
        `,
        expected: 3121910778619,
      },
    ],
    solution: (rawInput: string) => solver(parseInput(rawInput), 12),
  },
  trimTestInputs: true,
  onlyTests: false,
});
