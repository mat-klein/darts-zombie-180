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

type DartHitHistoryItem = {
  score: number;
  dartIndex: number;
} & DartHit;

const dartsPerRound = 3;

function App() {
  const playerName = 'PlayerX';
  const [hits, setHits] = useState<DartHitHistoryItem[]>([]);
  const [boardActive, setBoardActive] = useState(false);
  const [boardZoom, setBoardZoom] = useState(false);
  const [isUndoPressed, setIsUndoPressed] = useState(false);
  const initialBoardPosition: Vector2 = useMemo(
    () => (boardZoom ? [0, -60] : [0.0, 40.0]),
    [boardZoom]
  );
  const initialBoardZoom = boardZoom ? 3 : 1.3;

  const boardTrigger = (number: number, slicePart: SlicePart) => {
    setBoardActive(false);
    setHits((hits) => [
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
      },
    ]);
  };

  const dartsRemaining =
    hits.length > 0
      ? dartsPerRound - 1 - hits[hits.length - 1].dartIndex || 3
      : dartsPerRound;

  const undoAction = () => {
    setHits((hits) => [...hits.slice(0, hits.length - 1)]);
  };

  const toggleZoom = () => setBoardZoom((boardZoom) => !boardZoom);

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
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 style={{ margin: 0 }}>{playerName}</h2>
        <h1 style={{ margin: 0 }}>
          {hits.reduce(
            (agg: number, hit: DartHitHistoryItem) => agg - hit.score,
            501
          )}
        </h1>
        <div style={{ width: 100 }}>
          {Array.from(Array(dartsRemaining).keys()).map((v, inx) => (
            <DartIcon key={inx} />
          ))}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          right: 8,
          height: 120,
          backgroundColor: 'rgba(220,220,220,0.6)',
          borderRadius: 8,
          padding: 12,
          display: boardActive ? 'none' : undefined,
        }}
      >
        {hits
          .slice(-5)
          .reverse()
          .map((hit, inx) => (
            <p key={inx} style={{ margin: 0 }}>
              Player X hit {dartHitShortString(hit)} with dart{' '}
              {hit.dartIndex + 1}
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
            display: boardActive ? 'none' : undefined,
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
            display: boardActive ? 'none' : undefined,
          }}
          onClick={toggleZoom}
        >
          🔍
        </div>
      </div>
    </div>
  );
}

export default App;
