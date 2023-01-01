import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './components/Board';

function App() {
  const [hits, setHits] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [boardActive, setBoardActive] = useState(false);
  const [boardZoom, setBoardZoom] = useState(false);
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
        initialPosition={boardZoom ? [0, -60] : [0.0, 0.0]}
        initialZoom={boardZoom ? 3 : 1.5}
        onActivate={() => setBoardActive(true)}
        onTrigger={(number, part) => {
          setBoardActive(false);
          console.log('board hit', number, part);
          setHits((hits) => [
            ...hits,
            `player X scored: ${number} in ${part}`,
          ]);
          setScore((score) => {
            const hitScore =
              number *
              (part === 'triple' ? 3 : part === 'double' ? 2 : 1);

            return score + hitScore;
          });
        }}
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
          display: boardActive ? 'none' : undefined,
        }}
      >
        <h1 style={{ margin: 0 }}>Score: {score}</h1>
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
        {hits.map((hit, inx) => (
          <p key={inx} style={{ margin: 0 }}>
            {hit}
          </p>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          height: 48,
          width: 48,
          backgroundColor: boardZoom
            ? 'rgba(210,34,34,0.9)'
            : 'rgba(24,210,34,0.7)',
          borderRadius: 8,
          padding: 12,
          display: boardActive ? 'none' : undefined,
        }}
        onClick={() => {
          setBoardZoom((boardZoom) => !boardZoom);
        }}
      >
        Zoom
        <br />
        {boardZoom ? '(on)' : '(off)'}
      </div>
    </div>
  );
}

export default App;
