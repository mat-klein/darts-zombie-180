import { InputHTMLAttributes, useContext, useRef, useState } from "react";
import { MenuButton } from "../components/ui/MenuButton";
import Modal from "../components/ui/Modal";
import { AppContext } from "../state/AppState";
import { observer } from "mobx-react-lite";
import Box from "../components/ui/Box";
import { SquareButton } from "../components/ui/SquareButton";
import { X01GameState, defaultSettings } from "../game/x01/X01GameState";

import delete_icon from "../assets/icons/material/delete.svg";
import add_icon from "../assets/icons/material/add.svg";
import remove_icon from "../assets/icons/material/remove.svg";

export type PlayerStatsScreenProps = {};

export const PlayerStatsScreen = observer(({}: PlayerStatsScreenProps) => {
  const appState = useContext(AppContext);
  const screenState = appState.screen;

  function toMainMenu() {
    screenState.changeRoute("startgame");
  }

  return (
    <Modal hideClose>
      <div className="flex flex-col justify-between gap-2 h-full">
        STATS
      </div>
    </Modal>
  );
});
