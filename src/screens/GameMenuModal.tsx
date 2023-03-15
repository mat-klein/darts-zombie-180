import { observer } from 'mobx-react-lite';
import { MenuButton } from '../components/ui/MenuButton';
import { MenuHeader } from '../components/ui/MenuHeader';
import Modal from '../components/ui/Modal';
import { useContext } from 'react';
import { AppContext } from '../state/AppState';

export type GameMenuModalProps = {};

export const GameMenuModal = observer(({}: GameMenuModalProps) => {
  const appState = useContext(AppContext);

  function onClose() {
    appState.screen.toggleGameMenu(false);
  }

  function onRestartGame() {
    // reset game
    appState.screen.toggleGameMenu(false);
    appState?.gameState?.restart();
  }

  function onExitGame() {
    appState.screen.changeRoute('startgame');
    appState.screen.toggleGameMenu(false);
  }

  return (
    <Modal onClose={onClose}>
      <MenuHeader>Game menu</MenuHeader>
      <MenuButton onClick={onRestartGame}>Restart game</MenuButton>
      <MenuButton onClick={onExitGame}>Exit game</MenuButton>
    </Modal>
  );
});
