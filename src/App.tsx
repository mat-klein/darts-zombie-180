import React, { useMemo, useState } from "react";
import "./App.css";
import Board from "./components/board/Board";
import DartIcon from "./components/icons/DartIcon";
import {
  DartHit,
  SlicePart,
  dartHitShortString,
  getHitScore,
} from "./utils/darts";
import { Vector2 } from "./utils/coordinates";
import { Color, newColor } from "./utils/colors";
import DartScoreLabel from "./components/game/DartScoreLabel";
import { SquareButton } from "./components/ui/SquareButton";
import OverlayBox from "./components/ui/OverlayBox";
import Box from "./components/ui/Box";
import { AppContext, AppState } from "./state/AppState";
import { GameMenuModal } from "./screens/GameMenuModal";
import { StartGameScreen } from "./screens/StartGameScreen";
import { observer } from "mobx-react-lite";
import { PlayerSelectScreen } from "./screens/PlayerSelectScreen";
import { PlayerCardsScreen } from "./screens/PlayerCardsScreen";
import { GameOverScreen } from "./screens/GameOverScreen";
import { X01GameState, defaultSettings } from "./game/x01/X01GameState";
import { HamburgerMenu } from "./screens/HamburgerMenu";

import menu_icon from "./assets/icons/material/menu.svg";
import close_icon from "./assets/icons/material/close.svg";
import rewind_icon from "./assets/icons/material/rewind.svg";
import search_icon from "./assets/icons/material/search.svg";
import { X01GameCheckout } from "./game/x01/X01GameCheckout";

const App = observer(() => {
  const [appState] = useState(() => new AppState());
  const screenState = appState.screen;
  const gameState = appState.gameState as X01GameState | undefined;
  const gameCheckouts = new X01GameCheckout();

  const [boardActive, setBoardActive] = useState(false);
  const [boardZoom, setBoardZoom] = useState(false);
  const [showDistribution, setShowDistribution] = useState(false);
  //const [soundEnabled, setSoundEnabled] = useState(false);
  const initialBoardPosition: Vector2 = useMemo(
    () => (boardZoom ? [0, -75] : [0.0, 0.0]),
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
    if (gameState.tellScore !== undefined && appState.soundState) {
      const scored = gameState.tellScore;
      let utterance = new SpeechSynthesisUtterance(
        scored <= 0
          ? "no score"
          : scored < 10
          ? `${scored} scored`
          : `${scored}`
      );
      const voicesList = speechSynthesis.getVoices();
      utterance.voice =
        voicesList.reverse().find(
          (voice) => voice.name === "Daniel" // hotfix for iOS en-GB voice
        ) || null;
      utterance.lang = "en-GB";
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
  const fullOverlayColors: Record<number, Partial<Record<SlicePart, Color>>> = {
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

  const overlayColors = appState.distributionState
    ? gameState?.getCurrentPlayerStats().hits.reduce((agg, hit) => {
        const color = agg[hit.number][hit.slicePart] as Color;
        color.red = color.red > hitColorDelta ? color.red - hitColorDelta : 0;
        color.green = color.red;
        return agg;
      }, fullOverlayColors)
    : gameState?.getCurrentPlayerStats().currentRoundHits.reduce((agg, hit) => {
        if (!agg[hit.number]) {
          agg[hit.number] = {};
        }
        agg[hit.number][hit.slicePart] = newColor(255, 255, 0, 0.3);
        return agg;
      }, {} as Record<number, Partial<Record<SlicePart, Color>>>);

  function undoAction() {
    gameState?.undoDartHit();
  }

  return (
    <AppContext.Provider value={appState}>
      <div
        style={{
          position: "fixed",
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
        <Box
          style={{
            position: "fixed",
            bottom: 132,
            right: 4,
            borderRadius: "8px",
            boxShadow: "0px 0px 3px rgba(255, 255, 255, 1)",
            backgroundColor: "rgba(178,178,178, 0.6)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          <SquareButton isActive onClick={undoAction}>
            <img src={rewind_icon} alt="" />
          </SquareButton>
        </Box>
        <Box
          style={{
            position: "fixed",
            bottom: 132,
            left: 4,
            borderRadius: "8px",
            boxShadow: "0px 0px 3px rgba(255, 255, 255, 1)",
            backgroundColor: "rgba(178,178,178, 0.6)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          <SquareButton
            isActive
            onClick={() => setBoardZoom((boardZoom) => !boardZoom)}
          >
            <img src={search_icon} alt="" />
          </SquareButton>
        </Box>
        {gameState && (
          <OverlayBox
            hide={boardActive}
            style={{
              top: 0,
              left: 0,
              right: 0,
              height: 128,
              padding: 8,
            }}
          >
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              style={{ gap: 8 }}
            >
              <div className="text-4xl font-bold">
                {/*hits.reduce(
                  (agg: number, hit: DartHitHistoryItem) =>
                    agg - hit.score,
                  501
                )*/}
                {gameState.getCurrentPlayerStats().scoreRemaining -
                  gameState.getCurrentPlayerStats().currentRoundScore}
              </div>
              <div className="text-3xl font-semibold w-full">
                {appState.players.players[gameState.getCurrentPlayer()].icon}{" "}
                {appState.players.players[gameState.getCurrentPlayer()].name}
              </div>
              <SquareButton
                isActive={screenState.showHamburgerMenu}
                onClick={() => screenState.toggleHamburgerMenu()}
              >
                <img src={menu_icon} alt="" />
              </SquareButton>
            </Box>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <div className="flex flex-col w-28 drop-shadow-sm">
                <div className="flex flex-row gap-2">
                  <DartIcon />
                  <img src={close_icon} alt="" className="w-8 h-8" />
                  <div className="text-3xl text-center leading-8 w-8">
                    {gameState.getCurrentPlayerStats().currentLegHits.length}
                  </div>
                </div>

                <div className="flex flex-col justify-center text-base text-center font-bold leading-4 tracking-widest h-8">
                  {gameState.getCurrentPlayerStats().currentLegHits.length !==
                    0 && (
                    <>
                      <div>
                        {(
                          ((gameState.getCurrentPlayerStats().currentLegScore +
                            gameState.getCurrentPlayerStats()
                              .currentRoundScore) /
                            gameState.getCurrentPlayerStats().currentLegHits
                              .length) *
                          3
                        ).toFixed(1)}
                      </div>
                      <div>Leg average</div>
                    </>
                  )}
                </div>
              </div>
              <div
                style={{
                  paddingTop: 8,
                  margin: 0,
                  display: "flex",
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                {gameState
                  .getCurrentPlayerStats()
                  .currentRoundHits.map((hit, inx) => (
                    <DartScoreLabel key={inx} hit={hit} small />
                  ))}
              </div>
              <div className="flex flex-col w-28 drop-shadow-sm">
                <div className="flex flex-row justify-end w-28 gap-2">
                  {Array.from(Array(gameState.getDartsRemaining()).keys()).map(
                    (v, inx) => (
                      <DartIcon key={inx} />
                    )
                  )}
                  {/*Array.from(Array(dartsRemaining).keys()).map(
                  (v, inx) => (
                    <DartIcon key={inx} />
                  )
                  )*/}
                </div>
                <div className="flex flex-col text-base text-center font-bold leading-4 tracking-widest w-28 h-8">
                  {gameCheckouts.isCheckoutPossible(
                    gameState.getCurrentPlayerStats().scoreRemaining -
                      gameState.getCurrentPlayerStats().currentRoundScore,
                    gameState.getDartsRemaining()
                  ) && (
                    <>
                      <div className="flex flex-row justify-end gap-2 h-4">
                        {gameCheckouts
                          .getCheckoutDarts(
                            gameState.getCurrentPlayerStats().scoreRemaining -
                              gameState.getCurrentPlayerStats()
                                .currentRoundScore,
                            gameState.getDartsRemaining()
                          )
                          .map(
                            (hit, inx) =>
                              hit !== undefined && (
                                <div key={inx} className="w-8">
                                  {dartHitShortString({
                                    number: hit.number,
                                    slicePart: hit.slicePart,
                                  })}
                                </div>
                              )
                          )}
                      </div>
                      <div>Checkout</div>
                    </>
                  )}
                </div>
              </div>
            </Box>
          </OverlayBox>
        )}
        <OverlayBox
          hide={boardActive}
          flexDirection="row"
          justifyContent="space-between"
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            height: 128,
            padding: 8,
            overflowX: "scroll",
          }}
        >
          <Box
            flexDirection="row"
            style={{
              flex: "none",
              filter: "drop-shadow(0px 0px 3px rgba(255, 255, 255, 1))",
            }}
          >
            <div className="flex flex-col justify-between text-center p-1">
              <p className="h-5">
                {gameState && gameState.settings.setsToWin > 1
                  ? defaultSettings.setsToWin + "/" + defaultSettings.legsToSet
                  : defaultSettings.legsToSet}
              </p>
              <p className="h-5">Score</p>
              <p className="h-5">
                {gameState && gameState.settings.setsToWin > 1 ? "S/L" : "Legs"}
              </p>
              <p className="h-5">AVG</p>
              <p className="h-5">OUT</p>
            </div>
            {gameState &&
              gameState.getPlayerList().map((playerId, inx) => {
                const player = appState.players.players[playerId];
                return (
                  <>
                    <Box
                      key={player.id}
                      style={{
                        justifyContent: "space-between",
                        backgroundColor:
                          inx % 2 === 0 ? "rgba(178,178,178, 0.6)" : "",
                        borderRadius: "8px",
                        textAlign: "center",
                        width: "96px",
                        padding: "4px",
                        overflowX: "scroll",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div className="drop-shadow-sm h-5">
                        {player.icon}
                        {player.name}
                      </div>
                      <div className="drop-shadow-sm h-5">
                        {gameState.getPlayerScore(playerId)}
                      </div>
                      <div className="drop-shadow-sm h-5">
                        {gameState.settings.setsToWin > 1
                          ? `${gameState.getPlayerStats(playerId).sets}/${
                              gameState.getPlayerStats(playerId).legs
                            }`
                          : `${gameState.getPlayerStats(playerId).legs}`}
                      </div>
                      <div className="drop-shadow-sm h-5">
                        {gameState.getPlayerStats(playerId).hits.length === 0
                          ? "0"
                          : (
                              ((gameState.getPlayerStats(playerId).totalScore +
                                gameState.getPlayerStats(playerId)
                                  .currentRoundScore) *
                                3) /
                              gameState.getPlayerStats(playerId).hits.length
                            ).toFixed(1)}
                      </div>
                      <div className="drop-shadow-sm h-5">
                        {
                          gameState
                            .getPlayerStats(playerId)
                            .checkoutAttempts.filter(
                              (hit) =>
                                hit.targetExpected !== undefined &&
                                hit.targetExpected.number === hit.number &&
                                hit.targetExpected.slicePart === hit.slicePart
                            ).length
                        }
                        {"/"}
                        {
                          gameState.getPlayerStats(playerId).checkoutAttempts
                            .length
                        }
                        {" ("}
                        {(
                          (gameState.getPlayerStats(playerId).checkoutAttempts
                            .length === 0
                            ? 0
                            : gameState
                                .getPlayerStats(playerId)
                                .checkoutAttempts.filter(
                                  (hit) =>
                                    hit.targetExpected !== undefined &&
                                    hit.targetExpected.number === hit.number &&
                                    hit.targetExpected.slicePart ===
                                      hit.slicePart
                                ).length /
                              gameState.getPlayerStats(playerId)
                                .checkoutAttempts.length) * 100
                        ).toFixed(0)}
                        {"%)"}
                      </div>
                    </Box>
                  </>
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
        </OverlayBox>
        {screenState.showGameMenu && <GameMenuModal />}
        {screenState.showHamburgerMenu && <HamburgerMenu />}
        {screenState.currentRoute === "startgame" && <StartGameScreen />}
        {screenState.currentRoute === "playerselect" && <PlayerSelectScreen />}
        {screenState.currentRoute === "playercards" && <PlayerCardsScreen />}
        {gameState && gameState.hasGameEnded() && <GameOverScreen />}
      </div>
    </AppContext.Provider>
  );
});

export default App;
