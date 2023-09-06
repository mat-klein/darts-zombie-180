export type SlicePart = "none" | "inner" | "triple" | "outer" | "double";

export const boardSliceNumbers = [
  20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
];

export type DartHit = {
  number: number;
  slicePart: SlicePart;
  targetExpected?: DartHit;
};

export function getHitScore(hit: DartHit) {
  return (
    hit.number *
    (hit.slicePart === "triple" ? 3 : hit.slicePart === "double" ? 2 : 1)
  );
}

export function dartHitShortString(hit: DartHit) {
  if (hit !== undefined) {
    if (hit.number === 25 && hit.slicePart === "double") {
      return "50";
    }
    if (hit.slicePart === "none") {
      return "MISS";
    }
    return (
      (hit.slicePart === "double"
        ? "D"
        : hit.slicePart === "triple"
        ? "T"
        : "") + hit.number
    );
  }
}
