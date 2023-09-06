import { observer } from "mobx-react-lite";
import Modal from "../components/ui/Modal";
import { useContext, useState } from "react";
import { AppContext } from "../state/AppState";
import { MenuButton } from "../components/ui/MenuButton";

import stats_icon from "../assets/icons/material/stats.svg";
import soundOn_icon from "../assets/icons/material/sound_on.svg";
import soundOff_icon from "../assets/icons/material/sound_off.svg";
import replay_icon from "../assets/icons/material/replay.svg";
import newgame_icon from "../assets/icons/material/add.svg";
import home_icon from "../assets/icons/material/home.svg";

export type HamburgerMenuProps = {};

export const HamburgerMenu = observer(({}: HamburgerMenuProps) => {
  const appState = useContext(AppContext);
  const screenState = appState.screen;
  const [soundEnabled, setSoundEnabled] = useState(false);

  function onClose() {
    appState.screen.toggleHamburgerMenu(false);
  }

  function onRestartGame() {
    // reset game
    appState.screen.toggleHamburgerMenu(false);
    appState?.gameState?.restart();
  }

  function onExitGame() {
    appState.screen.changeRoute("game");
    appState.screen.toggleHamburgerMenu(false);
  }

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col self-center gap-4 w-full">
        <MenuButton
          onClick={() => {
            screenState.toggleHamburgerMenu();
            appState.distributionState = !appState.distributionState;
          }}
        >
          <div className="flex justify-between w-full">
            <img src={stats_icon} alt="" className="w-8 h-8 invert" />
            <div>Show Distribution</div>
            <img src={stats_icon} alt="" className="w-8 h-8 invert" />
          </div>
        </MenuButton>
        <MenuButton
          onClick={() => {
            appState.soundState = !appState.soundState;
            screenState.toggleHamburgerMenu();
          }}
        >
          <div className="flex justify-between w-full">
            <img
              src={appState.soundState ? soundOn_icon : soundOff_icon}
              alt=""
              className="w-8 h-8 invert"
            />
            <div>Toggle Sound</div>
            <img
              src={appState.soundState ? soundOn_icon : soundOff_icon}
              alt=""
              className="w-8 h-8 invert"
            />
          </div>
        </MenuButton>
        <MenuButton
          onClick={() => {
            screenState.toggleHamburgerMenu();
            appState?.gameState?.restart();
          }}
        >
          <div className="flex justify-between w-full">
            <img src={replay_icon} alt="" className="w-8 h-8 invert" />
            <div>Restart Game</div>
            <img src={replay_icon} alt="" className="w-8 h-8 invert" />
          </div>
        </MenuButton>
        <MenuButton
          onClick={() => {
            screenState.changeRoute("playerselect");
            screenState.toggleHamburgerMenu();
          }}
        >
          <div className="flex justify-between w-full">
            <img src={newgame_icon} alt="" className="w-8 h-8 invert" />
            <div>New Game</div>
            <img src={newgame_icon} alt="" className="w-8 h-8 invert" />
          </div>
        </MenuButton>
        <MenuButton
          onClick={() => {
            screenState.changeRoute("startgame");
            screenState.toggleHamburgerMenu();
          }}
        >
          <div className="flex justify-between w-full">
            <img src={home_icon} alt="" className="w-8 h-8 invert" />
            <div>Main Menu</div>
            <img src={home_icon} alt="" className="w-8 h-8 invert" />
          </div>
        </MenuButton>
      </div>
    </Modal>
  );
});
