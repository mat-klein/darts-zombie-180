import { DartHit, dartHitShortString } from "../../utils/darts";

type DartScoreLabelProps = {
  small?: boolean;
  big?: boolean;
  shadow?: boolean;
  hit: DartHit;
};

export default function DartScoreLabel({
  hit,
  small,
  big,
  shadow,
}: DartScoreLabelProps) {
  const isHigh =
    hit.slicePart === "double" ||
    hit.slicePart === "triple" ||
    hit.number === 25;
  const isMiss = hit.slicePart === "none";
  return (
    <div
      style={{
        padding: big ? "16px 32px" : small ? "2px 4px" : "4px 8px",
        boxShadow: big ? "0 2px 8px gray" : undefined,
        borderStyle: "solid",
        borderColor: isMiss ? "#8f525d" : "#22634F",
        borderWidth: big ? 8 : small ? 2 : 2,
        borderRadius: big ? 8 : small ? 4 : 4,
        backgroundColor: isMiss ? "#8f525d" : isHigh ? "#22634F" : "#D5F0E1",
        color: isMiss ? "#e2cdd0" : isHigh ? "#D5F0E1" : "#22634F",
        textAlign: "center",
        boxSizing: "border-box",
        fontSize: big ? 48 : small ? 12 : 14,
        fontWeight: big ? 700 : small ? 400 : 600,
        minWidth: small ? 48 : 64,
        width: big ? 178 : undefined,
        opacity: shadow ? 0.4 : big ? 0.95 : undefined,
      }}
    >
      {dartHitShortString(hit)}
    </div>
  );
}
