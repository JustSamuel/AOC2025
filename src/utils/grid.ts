export const parse = (rawInput: string): string[][] => {
  return rawInput
    .trim()
    .split("\n")
    .map((line) => line.trim().split(""));
};

export const forEachCell = <T>(
  grid: T[][],
  callback: (row: number, column: number, value: T) => void,
): void => {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      callback(r, c, grid[r][c]);
    }
  }
};

export const inGrid = <T>(
  grid: T[][],
  row: number,
  column: number,
): boolean => {
  return (
    row >= 0 && row < grid.length && column >= 0 && column < grid[row].length
  );
};
