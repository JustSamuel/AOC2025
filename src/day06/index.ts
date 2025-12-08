import run from "aocrunner";

interface Problem {
  numbers: number[];
  type: "*" | "+";
}

const parseInput = (rawInput: string, part2 = false): Problem[] => {
  const lines = rawInput.trimEnd().split("\n");

  const cols = Math.max(...lines.map((line) => line.length));
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length < cols) lines[i] = lines[i].padEnd(cols, " ");
  }

  const problems: Problem[] = [];
  const height = lines.length - 1;
  let col = 0;

  while (col < cols) {
    // Is there a number in this column
    let any = false;
    for (let r = 0; r <= height; r++) {
      if (lines[r][col] !== " ") {
        any = true;
        break;
      }
    }
    if (!any) {
      col++;
      continue;
    }

    // Find right end of block
    let end = col;
    while (end + 1 < cols) {
      let next = false;
      for (let r = 0; r <= height; r++) {
        if (lines[r][end + 1] !== " ") {
          next = true;
          break;
        }
      }
      if (!next) break;
      end++;
    }

    const currentNumbers: number[] = [];

    if (!part2) {
      for (let r = 0; r < height; r++) {
        const s = lines[r].slice(col, end + 1).trim();
        currentNumbers.push(parseInt(s, 10));
      }
    } else {
      for (let c = end; c >= col; c--) {
        const digits: string[] = [];
        for (let r = 0; r < height; r++) {
          const ch = lines[r][c];
          digits.push(ch);
        }
        currentNumbers.push(parseInt(digits.join(""), 10));
      }
    }

    const op = lines[height].slice(col, end + 1).trim();
    problems.push({ numbers: currentNumbers, type: op as "+" | "*" });

    col = end + 1;
  }

  return problems;
};

const evaluate = (problems: Problem[]) => {
  return problems.map((problem) => {
    const { numbers, type } = problem;
    if (type === "+") return numbers.reduce((acc, num) => acc + num, 0);
    if (type === "*") return numbers.reduce((acc, num) => acc * num, 1);
    return 0;
  });
};

const part1 = (rawInput: string) => {
  const problems = parseInput(rawInput, false);
  const results = evaluate(problems);
  return results.reduce((acc, num) => acc + num, 0);
};

const part2 = (rawInput: string) => {
  const problems = parseInput(rawInput, true);
  const results = evaluate(problems);
  return results.reduce((acc, num) => acc + num, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
  123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +        
        `,
        expected: 4277556,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
  123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +        
        `,
        expected: 3263827,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
