import React, { useMemo, useState } from 'react';
import './App.css';
import Board from './components/board/Board';
import DartIcon from './components/icons/DartIcon';
import { DartHit, SlicePart } from './utils/darts';
import { Vector2 } from './utils/coordinates';
import { Color, newColor } from './utils/colors';
import DartScoreLabel from './components/game/DartScoreLabel';
import { SquareButton } from './components/ui/SquareButton';
import OverlayBox from './components/ui/OverlayBox';
import Modal from './components/ui/Modal';
import { MenuButton } from './components/ui/MenuButton';

type DartHitHistoryItem = {
  score: number;
  dartIndex: number;
  round: number;
} & DartHit;

type BigHitDartDisplay = {
  isShadow?: boolean;
} & DartHit;

const dartsPerRound = 3;

function App() {
  const playerName = 'PlayerX';
  const [hits, setHits] = useState<DartHitHistoryItem[]>([]);
  const [boardActive, setBoardActive] = useState(false);
  const [boardZoom, setBoardZoom] = useState(false);
  const [showBigHit, setShowBigHit] = useState<
    BigHitDartDisplay | undefined
  >(undefined);
  const [showDistribution, setShowDistribution] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [tellScore, setTellScore] = useState(false);
  const initialBoardPosition: Vector2 = useMemo(
    () => (boardZoom ? [0, -60] : [0.0, 40.0]),
    [boardZoom]
  );
  const initialBoardZoom = boardZoom ? 3 : 1.3;

  const boardTrigger = (number: number, slicePart: SlicePart) => {
    const newHit = { number, slicePart };
    setShowBigHit(newHit);
    setBoardActive(false);
    setHits((hits) => {
      const lastDartRound =
        hits.length > 0 ? hits[hits.length - 1].round : 0;
      const lastDartIndex =
        hits.length > 0 ? hits[hits.length - 1].dartIndex : 999;
      const dartIndex =
        hits.length > 0
          ? (hits[hits.length - 1].dartIndex + 1) % dartsPerRound
          : 0;

      setSoundEnabled((soundEnabled) => {
        if (soundEnabled && dartIndex === dartsPerRound - 1) {
          setTellScore(true);
        }
        return soundEnabled;
      });

      return [
        ...hits,
        {
          ...newHit,
          score:
            number *
            (slicePart === 'triple'
              ? 3
              : slicePart === 'double'
              ? 2
              : 1),
          dartIndex,
          round:
            lastDartIndex >= dartsPerRound - 1
              ? lastDartRound + 1
              : lastDartRound,
        },
      ];
    });
  };

  function restartGame() {
    setHits([]);
    setShowMenu(false);
  }

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
    round: number;
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
      round: inx + 1,
      hits: [],
      score: 0,
    }))
  );
  const thisRoundStats = roundStats[roundStats.length - 1];
  const lastRoundsStats = roundStats.slice(0, -1).reverse();

  if (tellScore && lastRoundsStats.length > 0) {
    const scored = lastRoundsStats[0].score;
    let utterance = new SpeechSynthesisUtterance(
      scored <= 0
        ? 'no score'
        : scored < 10
        ? `${scored} scored`
        : `${scored}`
    );
    const voicesList = speechSynthesis.getVoices();
    /*alert(
      voicesList
        .filter((voice) => voice.lang.startsWith('en-'))
        .map((voice) => `${voice.name} - ${voice.lang}`)
        .join(', ')
    );*/
    utterance.voice =
      voicesList.reverse().find(
        (voice) => voice.name === 'Daniel' // hotfix for iOS en-GB voice
      ) || null;
    utterance.lang = 'en-GB';
    if (scored >= 100) {
      utterance.pitch = 1.1;
      utterance.rate = 0.75;
    } else {
      utterance.pitch = 0.9;
      utterance.rate = 0.8;
    }
    speechSynthesis.speak(utterance);
    setTellScore(false);
  }

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
        bigHitDisplay={showBigHit}
        onStartSelection={() => {
          setBoardActive(true);
          setShowBigHit(undefined);
        }}
        onStopSelection={() => setBoardActive(false)}
        onActivateElement={(number: number, part: SlicePart) =>
          setShowBigHit({ number, slicePart: part, isShadow: true })
        }
        onDeactivateElement={(number: number, part: SlicePart) =>
          setShowBigHit(undefined)
        }
        onTriggerElement={boardTrigger}
        onScreenViewReset={() =>
          setTimeout(() => {
            setShowBigHit(undefined);
          }, 250)
        }
      />
      <OverlayBox
        hide={boardActive}
        style={{
          top: 8,
          left: 8,
          right: 8,
          padding: 12,
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
          <div
            style={{
              paddingTop: 8,
              margin: 0,
              display: 'flex',
              flexDirection: 'row',
              gap: 8,
            }}
          >
            {thisRoundStats.hits.map((hit, inx) => (
              <DartScoreLabel key={inx} hit={hit} />
            ))}
          </div>
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
      </OverlayBox>
      <OverlayBox
        hide={boardActive}
        flexDirection="row"
        style={{
          bottom: 32,
          left: 8,
          right: 8,
          height: 128,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            gap: 8,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: 8,
          }}
        >
          {lastRoundsStats.map((roundStats, inx) => (
            <div
              key={roundStats.round}
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 4,
              }}
            >
              <div
                style={{
                  lineHeight: '20px',
                }}
              >
                {roundStats.round}:
              </div>
              {roundStats.hits.map((hit, inx) => (
                <DartScoreLabel key={inx} small hit={hit} />
              ))}
              <div
                style={{
                  lineHeight: '20px',
                }}
              >
                ({roundStats.score})
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            gap: 8,
            flexWrap: 'wrap',
            padding: 8,
            justifyContent: 'flex-end',
          }}
        >
          <SquareButton onClick={undoAction}>⬅️</SquareButton>
          <SquareButton
            isActive={soundEnabled}
            onClick={() =>
              setSoundEnabled((soundEnabled) => !soundEnabled)
            }
          >
            {soundEnabled ? '🔈' : '🔇'}
          </SquareButton>
          <SquareButton
            isActive={boardZoom}
            onClick={() => setBoardZoom((boardZoom) => !boardZoom)}
          >
            🔍
          </SquareButton>
          <SquareButton
            isActive={showDistribution}
            onClick={() =>
              setShowDistribution(
                (showDistribution) => !showDistribution
              )
            }
          >
            📊
          </SquareButton>
          <SquareButton
            isActive={showMenu}
            onClick={() => setShowMenu((showMenu) => !showMenu)}
          >
            💠
          </SquareButton>
        </div>
      </OverlayBox>
      {showMenu && (
        <Modal onClose={() => setShowMenu(false)}>
          <h2>Game menu</h2>
          <MenuButton onClick={restartGame}>Restart game</MenuButton>
        </Modal>
      )}
    </div>
  );
}

export default App;
