import { InputHTMLAttributes, useContext, useRef, useState } from "react";
import { MenuButton } from "../components/ui/MenuButton";
import Modal from "../components/ui/Modal";
import { AppContext } from "../state/AppState";
import { observer } from "mobx-react-lite";
import Box from "../components/ui/Box";
import { SquareButton } from "../components/ui/SquareButton";
import { X01GameState, defaultSettings } from "../game/x01/X01GameState";

import add_icon from "../assets/icons/material/add.svg";
import delete_icon from "../assets/icons/material/delete.svg";
import stats_icon from "../assets/icons/material/stats.svg";

export type PlayerCardsScreenProps = {};

export const PlayerCardsScreen = observer(({}: PlayerCardsScreenProps) => {
  const appState = useContext(AppContext);
  const screenState = appState.screen;

  function toMainMenu() {
    screenState.changeRoute("startgame");
  }

  return (
    <Modal hideClose>
      <div className="flex flex-col justify-between gap-2 h-full">
        <Box
          gap={8}
          style={{
            overflowY: "auto",
          }}
        >
          {Object.entries(appState.players.players).map(([id, player]) => (
            <Box
              key={id}
              padding="8px"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              style={{
                backgroundColor: "#22634F",
                color: "#FFFFFF",
                borderRadius: 4,
              }}
            >
              <Box
                flexDirection="row"
                justifyContent="space-between"
                gap={8}
                style={{ width: "100%" }}
              >
                <div className="flex flex-row justify-between text-2xl">
                  {player.icon}
                  {player.name}
                </div>
                <div className="flex flex-row gap-2">
                  <SquareButton size="small">
                    <img src={stats_icon} alt="" className="invert" />
                  </SquareButton>
                  <SquareButton size="small">
                    <img src={delete_icon} alt="" className="invert" />
                  </SquareButton>
                </div>
              </Box>
            </Box>
          ))}
        </Box>
        <MenuButton onClick={toMainMenu} size="large">
          Main Menu
        </MenuButton>
      </div>
    </Modal>
  );
});
