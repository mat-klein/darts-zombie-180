import { useContext, useEffect } from 'react';
import { MenuButton } from '../components/ui/MenuButton';
import { MenuHeader } from '../components/ui/MenuHeader';
import Modal from '../components/ui/Modal';
import { AppContext } from '../state/AppState';
import { observer } from 'mobx-react-lite';
import { X01GameState } from '../game/x01/X01GameState';

export type StartGameScreenProps = {
  onClose?: () => void;
  onRestartGame?: () => void;
};

export const StartGameScreen = observer(
  ({ onClose, onRestartGame }: StartGameScreenProps) => {
    const appState = useContext(AppContext);

    function startX01() {
      appState.screen.changeRoute('playerselect');
    }

    /*
    // develop only
    useEffect(() => {
      appState.newGame(
        new X01GameState(
          Object.values(appState.players.players)
            .filter(
              (p) =>
                p.name === 'Tobias' ||
                p.name === 'Nico' ||
                p.name === 'Raphael'
            )
            .map((p) => p.id)
        )
      );
      appState.screen.changeRoute('game');
    }, []);
    */

    return (
      <Modal hideClose>
        <MenuHeader>Start new game</MenuHeader>
        <MenuButton onClick={startX01}>301 / 501 / 701</MenuButton>
        <MenuButton disabled>Around the Clock</MenuButton>
      </Modal>
    );
  }
);
