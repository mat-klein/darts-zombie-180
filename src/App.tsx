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
import Box from './components/ui/Box';
import { AppContext, AppState } from './state/AppState';
import { GameMenuModal } from './screens/GameMenuModal';
import { StartGameScreen } from './screens/StartGameScreen';
import { observer } from 'mobx-react-lite';
import { PlayerSelectScreen } from './screens/PlayerSelectScreen';
import { GameOverScreen } from './screens/GameOverScreen';
import { X01GameState } from './game/x01/X01GameState';

const App = observer(() => {
  const [appState] = useState(() => new AppState());
  const screenState = appState.screen;
  const gameState = appState.gameState as X01GameState | undefined;

  const [boardActive, setBoardActive] = useState(false);
  const [boardZoom, setBoardZoom] = useState(false);
  const [showDistribution, setShowDistribution] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const initialBoardPosition: Vector2 = useMemo(
    () => (boardZoom ? [0, -60] : [0.0, 40.0]),
    [boardZoom]
  );
  const initialBoardZoom = boardZoom ? 3 : 1.3;

  const boardTrigger = (number: number, slicePart: SlicePart) => {
    const newHit = { number, slicePart };
    if (appState.gameState) {
      appState.gameState.processDartHit(newHit);
    }
    setBoardActive(false);
  };

  if (gameState) {
    if (gameState.tellScore !== undefined && soundEnabled) {
      const scored = gameState.tellScore;
      let utterance = new SpeechSynthesisUtterance(
        scored <= 0
          ? 'no score'
          : scored < 10
          ? `${scored} scored`
          : `${scored}`
      );
      const voicesList = speechSynthesis.getVoices();
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
    }
    gameState.tellScore = undefined;
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
    ? gameState?.getCurrentPlayerStats().hits.reduce((agg, hit) => {
        const color = agg[hit.number][hit.slicePart] as Color;
        color.red =
          color.red > hitColorDelta ? color.red - hitColorDelta : 0;
        color.green = color.red;
        return agg;
      }, fullOverlayColors)
    : gameState
        ?.getCurrentPlayerStats()
        .currentRoundHits.reduce((agg, hit) => {
          if (!agg[hit.number]) {
            agg[hit.number] = {};
          }
          agg[hit.number][hit.slicePart] = newColor(255, 255, 0, 0.3);
          return agg;
        }, {} as Record<number, Partial<Record<SlicePart, Color>>>);

  function undoAction() {
    gameState?.undoDartHit();
  }

  console.log('appState.gameState', appState.gameState);

  return (
    <AppContext.Provider value={appState}>
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
          onStartSelection={() => {
            setBoardActive(true);
          }}
          onStopSelection={() => setBoardActive(false)}
          onTriggerElement={boardTrigger}
          disabled={gameState && gameState.hasGameEnded()}
        />
        {gameState && (
          <OverlayBox
            hide={boardActive}
            style={{
              top: 8,
              left: 8,
              right: 8,
              padding: 12,
            }}
          >
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <h2 style={{ margin: 0 }}>
                {
                  appState.players.players[
                    gameState.getCurrentPlayer()
                  ].icon
                }{' '}
                {
                  appState.players.players[
                    gameState.getCurrentPlayer()
                  ].name
                }
              </h2>
              <h1 style={{ margin: 0 }}>
                {/*hits.reduce(
                  (agg: number, hit: DartHitHistoryItem) =>
                    agg - hit.score,
                  501
                )*/}
                {gameState.getCurrentPlayerStats().scoreRemaining -
                  gameState.getCurrentPlayerStats().currentRoundScore}
              </h1>
              <div style={{ width: 100 }}>
                {Array.from(
                  Array(gameState.getDartsRemaining()).keys()
                ).map((v, inx) => (
                  <DartIcon key={inx} />
                ))}
                {/*Array.from(Array(dartsRemaining).keys()).map(
                  (v, inx) => (
                    <DartIcon key={inx} />
                  )
                  )*/}
              </div>
            </Box>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
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
                {gameState
                  .getCurrentPlayerStats()
                  .currentRoundHits.map((hit, inx) => (
                    <DartScoreLabel key={inx} hit={hit} />
                  ))}
              </div>
              {gameState.getCurrentPlayerStats().hits.length > 0 && (
                <p style={{ margin: 0 }}>
                  Avg:
                  {(
                    ((gameState.getCurrentPlayerStats().totalScore +
                      gameState.getCurrentPlayerStats()
                        .currentRoundScore) /
                      gameState.getCurrentPlayerStats().hits.length) *
                    3
                  ).toFixed(1)}
                </p>
              )}
            </Box>
          </OverlayBox>
        )}
        <OverlayBox
          hide={boardActive}
          flexDirection="row"
          justifyContent="space-between"
          style={{
            bottom: 32,
            left: 8,
            right: 8,
            height: 160,
            padding: 8,
          }}
        >
          <Box
            gap={8}
            style={{
              overflowY: 'auto',
              flex: 'none',
            }}
          >
            {gameState &&
              gameState.getPlayerList().map((playerId) => {
                const player = appState.players.players[playerId];

                return (
                  <Box key={player.id}>
                    {player.icon} {player.name}{' '}
                    {gameState.getPlayerScore(playerId)}
                    {gameState.settings.setsToWin > 1
                      ? ` (${
                          gameState.getPlayerStats(playerId).sets
                        }|${gameState.getPlayerStats(playerId).legs})`
                      : gameState.settings.legsToSet > 1
                      ? ` (${
                          gameState.getPlayerStats(playerId).legs
                        })`
                      : ''}
                  </Box>
                );
              })}
            {/*
              lastRoundsStats.map((roundStats, inx) => (
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
                  ))*/}
          </Box>
          <Box
            gap={8}
            flexDirection="row"
            justifyContent="flex-end"
            style={{
              flexWrap: 'wrap',
              maxWidth: 160,
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
              isActive={screenState.showGameMenu}
              onClick={() => screenState.toggleGameMenu()}
            >
              💠
            </SquareButton>
          </Box>
        </OverlayBox>
        {screenState.showGameMenu && <GameMenuModal />}
        {screenState.currentRoute === 'startgame' && (
          <StartGameScreen />
        )}
        {screenState.currentRoute === 'playerselect' && (
          <PlayerSelectScreen />
        )}
        {gameState && gameState.hasGameEnded() && <GameOverScreen />}
      </div>
    </AppContext.Provider>
  );
});

export default App;
