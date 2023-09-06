import { useContext, useEffect } from "react";
import { MenuButton } from "../components/ui/MenuButton";
import { MenuHeader } from "../components/ui/MenuHeader";
import Modal from "../components/ui/Modal";
import { AppContext } from "../state/AppState";
import { observer } from "mobx-react-lite";
import { X01GameState } from "../game/x01/X01GameState";

import dart_logo from "../assets/icons/for_free_family/dart_red_100.svg";

export type StartGameScreenProps = {
  onClose?: () => void;
  onRestartGame?: () => void;
};

export const StartGameScreen = observer(
  ({ onClose, onRestartGame }: StartGameScreenProps) => {
    const appState = useContext(AppContext);

    function startX01() {
      appState.screen.changeRoute("playerselect");
    }

    function toPlayerCards() {
      appState.screen.changeRoute("playercards");
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
        <MenuButton onClick={toPlayerCards} size="large">
          Playercards
        </MenuButton>
        <div className="h-0.5 rounded-full bg-grey-400" />
        <MenuButton onClick={startX01} size="large">
          301 / 501 / 701
        </MenuButton>
        <MenuButton disabled size="large">
          Around the Clock
        </MenuButton>
      </Modal>
    );
  }
);
