import { useContext, useEffect, useState } from 'react';
import { MenuButton } from '../components/ui/MenuButton';
import { MenuHeader } from '../components/ui/MenuHeader';
import Modal from '../components/ui/Modal';
import { AppContext } from '../state/AppState';
import { observer } from 'mobx-react-lite';
import Box from '../components/ui/Box';
import { X01GameState } from '../game/x01/X01GameState';

export type GameOverScreenProps = {
  onClose?: () => void;
  onRestartGame?: () => void;
};

export const GameOverScreen = observer(
  ({ onClose, onRestartGame }: GameOverScreenProps) => {
    const appState = useContext(AppContext);
    const gameState = appState.gameState as X01GameState;

    function restartGame() {
      console.log('restartGame');
      appState?.gameState?.restart();
    }

    const [timedDisable, setTimedDisable] = useState(true);
    useEffect(() => {
      setTimeout(() => setTimedDisable(false), 100);
    }, []);

    return (
      <Modal hideClose>
        <MenuHeader>Game over</MenuHeader>
        <Box>
          {gameState &&
            gameState.getRanking()?.map((playerId) => {
              const player = appState.players.players[playerId];

              return (
                <Box key={playerId}>
                  {player.icon} {player.name}
                  {' - Sets: '}
                  {gameState.getPlayerStats(playerId).sets}
                  {' - Legs: '}
                  {gameState.getPlayerStats(playerId).totalLegsWon}
                  {' - Avg: '}
                  {(
                    (gameState.getPlayerStats(playerId).totalScore /
                      gameState.getPlayerStats(playerId).hits
                        .length) *
                    3
                  ).toFixed(1)}
                </Box>
              );
            })}
        </Box>

        <MenuButton disabled={timedDisable} onClick={restartGame}>
          Restart game
        </MenuButton>
      </Modal>
    );
  }
);
