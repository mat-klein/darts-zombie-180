import React, { useMemo, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './components/board/Board';
import { useWindowSize } from 'usehooks-ts';
import DartIcon from './components/icons/DartIcon';
import {
  DartHit,
  SlicePart,
  dartHitShortString,
} from './utils/darts';
import { Vector2 } from './utils/coordinates';
import { Color, newColor } from './utils/colors';

type DartHitHistoryItem = {
  score: number;
  dartIndex: number;
  round: number;
} & DartHit;

const dartsPerRound = 3;

function App() {
  const playerName = 'PlayerX';
  const [hits, setHits] = useState<DartHitHistoryItem[]>([]);
  const [boardActive, setBoardActive] = useState(false);
  const [boardZoom, setBoardZoom] = useState(false);
  const [showDistribution, setShowDistribution] = useState(false);
  const [isUndoPressed, setIsUndoPressed] = useState(false);
  const initialBoardPosition: Vector2 = useMemo(
    () => (boardZoom ? [0, -60] : [0.0, 40.0]),
    [boardZoom]
  );
  const initialBoardZoom = boardZoom ? 3 : 1.3;

  const boardTrigger = (number: number, slicePart: SlicePart) => {
    setBoardActive(false);
    setHits((hits) => {
      const lastDartRound =
        hits.length > 0 ? hits[hits.length - 1].round : 0;
      const lastDartIndex =
        hits.length > 0 ? hits[hits.length - 1].dartIndex : 999;

      return [
        ...hits,
        {
          number,
          slicePart,
          score:
            number *
            (slicePart === 'triple'
              ? 3
              : slicePart === 'double'
              ? 2
              : 1),
          dartIndex:
            hits.length > 0
              ? (hits[hits.length - 1].dartIndex + 1) % dartsPerRound
              : 0,
          round:
            lastDartIndex >= dartsPerRound - 1
              ? lastDartRound + 1
              : lastDartRound,
        },
      ];
    });
  };

  const lastDartRound =
    hits.length > 0 ? hits[hits.length - 1].round : 0;
  const lastDartIndex =
    hits.length > 0 ? hits[hits.length - 1].dartIndex : 999;
  const thisRound =
    lastDartIndex >= dartsPerRound - 1
      ? lastDartRound + 1
      : lastDartRound;

  const dartsRemaining =
    hits.length > 0
      ? dartsPerRound - 1 - lastDartIndex || dartsPerRound
      : dartsPerRound;

  type RoundStats = {
    hits: DartHitHistoryItem[];
    score: number;
  };
  const roundStats = hits.reduce(
    (agg: RoundStats[], hit) => {
      agg[hit.round - 1].hits.push(hit);
      agg[hit.round - 1].score += hit.score;
      return agg;
    },
    Array.from(Array(thisRound).keys()).map((inx) => ({
      hits: [],
      score: 0,
    }))
  );
  const thisRoundStats = roundStats[roundStats.length - 1];
  const lastRoundsStats = roundStats.slice(-5, -1).reverse();

  const hitColorDelta = 25;
  const fullOverlayColors: Record<
    number,
    Partial<Record<SlicePart, Color>>
  > = {
    0: { none: newColor(255, 255, 255, 0.95) },
    25: {
      outer: newColor(255, 255, 255, 1),
      double: newColor(255, 255, 255, 1),
    },
  };
  Array.from(Array(20).keys()).forEach((inx) => {
    fullOverlayColors[inx + 1] = {
      inner: newColor(255, 255, 255, 1),
      triple: newColor(255, 255, 255, 1),
      outer: newColor(255, 255, 255, 1),
      double: newColor(255, 255, 255, 1),
    };
  });
  const overlayColors = showDistribution
    ? hits.reduce((agg, hit) => {
        const color = agg[hit.number][hit.slicePart] as Color;
        color.red =
          color.red > hitColorDelta ? color.red - hitColorDelta : 0;
        color.green = color.red;
        return agg;
      }, fullOverlayColors)
    : hits
        .filter((hit) => hit.round === thisRound)
        .reduce((agg, hit) => {
          if (!agg[hit.number]) {
            agg[hit.number] = {};
          }
          agg[hit.number][hit.slicePart] = newColor(255, 255, 0, 0.3);
          return agg;
        }, {} as Record<number, Partial<Record<SlicePart, Color>>>);

  function undoAction() {
    setHits((hits) => [...hits.slice(0, hits.length - 1)]);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Board
        initialPosition={initialBoardPosition}
        initialZoom={initialBoardZoom}
        overlayColors={overlayColors}
        onActivate={() => setBoardActive(true)}
        onTrigger={boardTrigger}
      />
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          right: 8,
          backgroundColor: 'rgba(220,220,220,0.6)',
          borderRadius: 8,
          padding: 12,
          display: boardActive ? 'none' : 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0 }}>{playerName}</h2>
          <h1 style={{ margin: 0 }}>
            {hits.reduce(
              (agg: number, hit: DartHitHistoryItem) =>
                agg - hit.score,
              501
            )}
          </h1>
          <div style={{ width: 100 }}>
            {Array.from(Array(dartsRemaining).keys()).map(
              (v, inx) => (
                <DartIcon key={inx} />
              )
            )}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p style={{ margin: 0 }}>
            {thisRoundStats.hits
              .map((hit) => dartHitShortString(hit))
              .join(' ')}
          </p>
          {thisRound >= 2 && (
            <p style={{ margin: 0 }}>
              Avg:
              {(
                roundStats.slice(0, -1).reduce((score, rs) => {
                  return score + rs.score;
                }, 0) /
                (thisRound - 1)
              ).toFixed(1)}
            </p>
          )}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: 8,
          right: 8,
          height: 120,
          backgroundColor: 'rgba(220,220,220,0.6)',
          borderRadius: 8,
          padding: 12,
          display: boardActive ? 'none' : undefined,
        }}
      >
        {lastRoundsStats.map((roundStats, inx) => (
          <p key={inx} style={{ margin: 0 }}>
            Player X:{' '}
            {roundStats.hits
              .map((hit) => dartHitShortString(hit))
              .join(' ')}{' '}
            score {roundStats.score}
          </p>
        ))}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8 + 64 + 8,
            height: 64,
            width: 64,
            fontSize: 40,
            lineHeight: '40px',
            textAlign: 'center',
            boxSizing: 'border-box',
            backgroundColor: isUndoPressed
              ? 'rgba(120,120,120,0.9)'
              : 'rgba(180,180,180,0.9)',
            borderRadius: 8,
            padding: 12,
          }}
          onClick={undoAction}
          onTouchStart={() => setIsUndoPressed(true)}
          onTouchEnd={() => setIsUndoPressed(false)}
        >
          ⬅️
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            height: 64,
            width: 64,
            fontSize: 40,
            lineHeight: '40px',
            textAlign: 'center',
            boxSizing: 'border-box',
            backgroundColor: boardZoom
              ? 'rgba(210,34,34,0.9)'
              : 'rgba(24,210,34,0.7)',
            borderColor: 'black',
            borderStyle: 'solid',
            borderWidth: boardZoom ? 2 : 0,
            borderRadius: 8,
            padding: 12,
          }}
          onClick={() => setBoardZoom((boardZoom) => !boardZoom)}
        >
          🔍
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 8 + 64 + 8,
            right: 8,
            height: 64,
            width: 64,
            fontSize: 40,
            lineHeight: '40px',
            textAlign: 'center',
            boxSizing: 'border-box',
            backgroundColor: showDistribution
              ? 'rgba(210,34,34,0.9)'
              : 'rgba(24,210,34,0.7)',
            borderColor: 'black',
            borderStyle: 'solid',
            borderWidth: showDistribution ? 2 : 0,
            borderRadius: 8,
            padding: 12,
          }}
          onClick={() =>
            setShowDistribution(
              (showDistribution) => !showDistribution
            )
          }
        >
          📊
        </div>
      </div>
    </div>
  );
}

export default App;
