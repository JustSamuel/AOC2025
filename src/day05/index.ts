import run from "aocrunner";

const parseInput = (rawInput: string) => {
  const [rangesInput, idsInput] = rawInput.trim().split("\n\n");

  const ranges = rangesInput.split("\n").map((range) => {
    const [start, end] = range.split("-").map(Number);
    return { start, end };
  });

  const ids = idsInput.split("\n").map(Number);
  return { ranges, ids };
};

const part1 = (rawInput: string) => {
  const { ranges, ids } = parseInput(rawInput);

  const fresh = (id: number) => {
    return ranges.some(({ start, end }) => id >= start && id <= end);
  };

  return ids.filter(fresh).length;
};

const merge = (ranges: { start: number; end: number }[]) => {
  ranges.sort((a, b) => a.start - b.start);
  const merged: { start: number; end: number }[] = [];
  let current = ranges[0];

  for (let i = 1; i < ranges.length; i++) {
    const next = ranges[i];
    if (current.end >= next.start) {
      current.end = Math.max(current.end, next.end);
    } else {
      merged.push(current);
      current = next;
    }
  }
  merged.push(current);

  return merged;
};

const part2 = (rawInput: string) => {
  const { ranges } = parseInput(rawInput);
  const merged = merge(ranges);

  let count = 0;
  merged.forEach(({ start, end }) => {
    count += end - start + 1;
  });

  return count;
};

run({
  part1: {
    tests: [
      {
        input: `
3-5
10-14
16-20
12-18

1
5
8
11
17
32
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
3-5
10-14
16-20
12-18

1
5
8
11
17
32
        `,
        expected: 14,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
