import { DartHit, dartHitShortString } from '../../utils/darts';

type DartScoreLabelProps = { small?: boolean; hit: DartHit };

export default function DartScoreLabel({
  hit,
  small,
}: DartScoreLabelProps) {
  const isHigh =
    hit.slicePart === 'double' ||
    hit.slicePart === 'triple' ||
    hit.number === 25;
  const isMiss = hit.slicePart === 'none';
  return (
    <div
      style={{
        padding: small ? '2px 4px' : '4px 8px',
        borderRadius: 4,
        borderStyle: 'solid',
        borderColor: isMiss ? '#995555' : '#999955',
        borderWidth: small ? 1 : 2,
        backgroundColor: isMiss
          ? '#995555'
          : isHigh
          ? '#999955'
          : '#f4f4e4',
        color: isMiss ? '#f4c4c4' : isHigh ? '#f4f4e4' : '#999955',
        textAlign: 'center',
        boxSizing: 'border-box',
        fontSize: small ? 12 : 14,
        fontWeight: small ? 400 : 700,
        minWidth: small ? 40 : 48,
      }}
    >
      {dartHitShortString(hit)}
    </div>
  );
}
