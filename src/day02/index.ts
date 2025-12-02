import run from "aocrunner";

const parseInput = (rawInput: string): {start: number, end: number}[] => {
  const lines = rawInput.split(",");

  return lines.map((line) => {
      const [start, end] = line.split("-");
      return { start: Number(start), end: Number(end) };
    });
};

const isInvalid1 = (id: number): boolean => {
  const str = id.toString();
  const half = str.length / 2;
  return str.slice(0, half) === str.slice(half);
};

const isInvalid2 = (id: number): boolean => {
  const str = id.toString();
  const len = str.length;

  for (let s = 1; s <= len / 2; s++) {
    if (len % s !== 0) continue;

    const pattern = str.slice(0, s);
    const repeated = pattern.repeat(len / s);
    if (repeated === str) return true;
  }

  return false;
};

const solver = (input: {start: number, end: number}[], test: (id: number) => boolean) => {
  let sum = 0;

  for (const { start, end } of input) {
    for (let id = start; id <= end; id++) {
      if (test(id)) {
        sum += id;
      }
    }
  }

  return sum;
}

run({
  part1: {
    tests: [
     {
       input: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`,
       expected: 1227775554,
     },
    ],
    solution: (rawInput: string) => solver(parseInput(rawInput), isInvalid1),
  },
  part2: {
    tests: [
       {
         input: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`,
         expected: 4174379265,
       },
    ],
    solution: (rawInput: string) => solver(parseInput(rawInput), isInvalid2),
  },
  trimTestInputs: true,
  onlyTests: false,
});
