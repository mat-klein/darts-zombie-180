import { TouchEventHandler, useState } from 'react';
import { DartHit, dartHitShortString } from '../../utils/darts';

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
    hit.slicePart === 'double' ||
    hit.slicePart === 'triple' ||
    hit.number === 25;
  const isMiss = hit.slicePart === 'none';
  return (
    <div
      style={{
        padding: big ? '16px 32px' : small ? '2px 4px' : '4px 8px',
        borderRadius: big ? 32 : 4,
        boxShadow: big ? '0 2px 8px gray' : undefined,
        borderStyle: 'solid',
        borderColor: isMiss ? '#995555' : '#999955',
        borderWidth: big ? 8 : small ? 1 : 2,
        backgroundColor: isMiss
          ? '#995555'
          : isHigh
          ? '#999955'
          : '#f4f4e4',
        color: isMiss ? '#f4c4c4' : isHigh ? '#f4f4e4' : '#999955',
        textAlign: 'center',
        boxSizing: 'border-box',
        fontSize: big ? 48 : small ? 12 : 14,
        fontWeight: big ? 600 : small ? 400 : 700,
        minWidth: small ? 40 : 48,
        width: big ? 178 : undefined,
        opacity: shadow ? 0.4 : big ? 0.95 : undefined,
      }}
    >
      {dartHitShortString(hit)}
    </div>
  );
}
