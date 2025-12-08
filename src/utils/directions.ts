export enum Direction {
  NORTH = "NORTH",
  NORTHEAST = "NORTHEAST",
  EAST = "EAST",
  SOUTHEAST = "SOUTHEAST",
  SOUTH = "SOUTH",
  SOUTHWEST = "SOUTHWEST",
  WEST = "WEST",
  NORTHWEST = "NORTHWEST",
}

export const DirectionVectorMap: Record<Direction, [number, number]> = {
  [Direction.NORTH]: [-1, 0],
  [Direction.NORTHEAST]: [-1, 1],
  [Direction.EAST]: [0, 1],
  [Direction.SOUTHEAST]: [1, 1],
  [Direction.SOUTH]: [1, 0],
  [Direction.SOUTHWEST]: [1, -1],
  [Direction.WEST]: [0, -1],
  [Direction.NORTHWEST]: [-1, -1],
};

export const DirectionVectors = (
  directions: Direction[],
): [number, number][] => {
  return directions.map((dir) => DirectionVectorMap[dir]);
};

export const Cardinal: Direction[] = [
  Direction.NORTH,
  Direction.EAST,
  Direction.SOUTH,
  Direction.WEST,
];

export const Compass: Direction[] = [
  Direction.NORTH,
  Direction.NORTHEAST,
  Direction.EAST,
  Direction.SOUTHEAST,
  Direction.SOUTH,
  Direction.SOUTHWEST,
  Direction.WEST,
  Direction.NORTHWEST,
];

export const CardinalVectors: [number, number][] = Cardinal.map(
  (dir) => DirectionVectorMap[dir],
);

export const CompassVectors: [number, number][] = Compass.map(
  (dir) => DirectionVectorMap[dir],
);
