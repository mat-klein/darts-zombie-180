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
import { isValidDateValue } from "@testing-library/user-event/dist/utils";

export const allIcons = [
  ..."🔱🔴🟠🟡🟢🔵🟣🟤🟥🟧🟨🟩🟦🟪🟫🔶🔷🚩🎌🏳️‍🌈🏳️‍⚧️🏴‍☠️⛄💀🤡👾👻😸💞🔥🌊⚡⛱🌈🌀🎀🎋🎎🎃🎄🧨🧧🎀⚽🥎🏀🏐🏈🎾🥏🎳🏓🥊⛸🎣🪀🎱🔮🕹🎰🎲🧩🧸🪩🪆🎭🖼🪢🛍👑👒🧢💄💍💎🎸🎷🎻🥁🧮🏮💰🪃🏹🛡🪚🧰🧬🔭🩻🛋🪤🗿",
];

export type PlayerSelectScreenProps = {};

export const PlayerSelectScreen = observer(({}: PlayerSelectScreenProps) => {
  const appState = useContext(AppContext);

  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayerIcon, setNewPlayerIcon] = useState(
    allIcons[Math.floor(Math.random() * allIcons.length)]
  );
  const [newPlayerName, setNewPlayerName] = useState("");
  const [setsToWin, setSetsToWin] = useState(defaultSettings.setsToWin);
  const [legsToSet, setLegsToSet] = useState(defaultSettings.legsToSet);

  function start() {
    setPlayers((players) => {
      const game = new X01GameState(players);
      appState.newGame(game);
      return players;
    });
    appState.screen.changeRoute("game");
  }

  function togglePlayer(playerId: string) {
    setPlayers((players) => {
      if (players.indexOf(playerId) !== -1) {
        return players.filter((id) => id !== playerId);
      }
      return [...players, playerId];
    });
  }

  function updateWinConditions(sets: number, legs: number) {
    setSetsToWin(sets);
    setLegsToSet(legs);
    defaultSettings.setsToWin = sets;
    defaultSettings.legsToSet = legs;
  }

  console.log(players);

  return (
    <Modal hideClose>
      <MenuButton size="large" onClick={start} disabled={players.length <= 0}>
        Start Game
      </MenuButton>
      <div className="flex flex-row justify-between text-2xl">
        <div className="flex flex-row gap-2">
          Sets:
          {" " + setsToWin}
          <SquareButton
            size="small"
            color="red"
            disabled={setsToWin === 1 ? true : false}
            onClick={() => {
              updateWinConditions(setsToWin - 1, legsToSet);
            }}
          >
            <img
              src={remove_icon}
              alt=""
              className={setsToWin === 1 ? "" : "invert"}
            />
          </SquareButton>
          <SquareButton
            size="small"
            color="green"
            onClick={() => {
              updateWinConditions(setsToWin + 1, legsToSet);
            }}
          >
            <img src={add_icon} alt="" className={"invert"} />
          </SquareButton>
        </div>
        <div className="flex flex-row gap-2">
          Legs:
          {" " + legsToSet}
          <SquareButton
            size="small"
            color="red"
            disabled={legsToSet === 1 ? true : false}
            onClick={() => {
              updateWinConditions(setsToWin, legsToSet - 1);
            }}
          >
            <img
              src={remove_icon}
              alt=""
              className={legsToSet === 1 ? "" : "invert"}
            />
          </SquareButton>
          <SquareButton
            size="small"
            color="green"
            onClick={() => {
              updateWinConditions(setsToWin, legsToSet + 1);
            }}
          >
            <img src={add_icon} alt="" className={"invert"} />
          </SquareButton>
        </div>
      </div>
      <div className="h-0.5 rounded-full bg-grey-400" />
      {/*
      <Box
        flexDirection="row"
        gap={8}
        alignItems="center"
        style={{ flexWrap: "wrap" }}
      >
        {players.map((id) => (
          <Box
            key={id}
            padding="4px 8px"
            style={{
              backgroundColor: "rgba(224,224,187,0.9)",
              borderRadius: 4,
            }}
            onClick={() => togglePlayer(id)}
          >
            {appState.players.players[id].icon}{" "}
            {appState.players.players[id].name}&nbsp;&nbsp;✖
          </Box>
        ))}
      </Box>
      */}
      <Box
        gap={8}
        style={{
          overflowY: "auto",
        }}
      >
        {Object.entries(appState.players.players)
          //.filter(([id, player]) => players.indexOf(player.id) === -1)
          .map(([id, player]) => (
            <Box
              key={id}
              padding="8px"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
              style={{
                backgroundColor:
                  players.indexOf(id) === -1 ? "#B3B3B3" : "#22634F",
                color: players.indexOf(id) === -1 ? "#808080" : "#FFFFFF",
                borderRadius: 4,
              }}
            >
              <Box flexDirection="row" gap={8}>
                <div className="flex justify-center items-center text-2xl w-8">
                  {player.icon}
                </div>
                <div className="flex justify-center items-center text-2xl">
                  {player.name}
                </div>
              </Box>
              <Box flexDirection="row" gap={8}>
                <SquareButton
                  size="small"
                  onClick={() => togglePlayer(player.id)}
                >
                  <img
                    src={players.indexOf(id) === -1 ? add_icon : remove_icon}
                    alt=""
                    className={players.indexOf(id) === -1 ? "" : "invert"}
                  />
                </SquareButton>
                <SquareButton
                  size="small"
                  onClick={() => {
                    appState.players.deletePlayer(player.id);
                    players.indexOf(id) !== -1 && togglePlayer(player.id);
                  }}
                >
                  <img
                    src={delete_icon}
                    alt=""
                    className={players.indexOf(id) === -1 ? "" : "invert"}
                  />
                </SquareButton>
              </Box>
            </Box>
          ))}
      </Box>
      <div className="h-0.5 rounded-full bg-grey-400 mt-auto" />
      <Box
        padding="8px"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        gap={8}
        style={{
          backgroundColor:
            newPlayerName === "" || newPlayerName.length > 10
              ? "#B3B3B3"
              : "#22634F",
          borderRadius: 4,
        }}
      >
        <Box
          style={{
            flex: "0 0 48px",
            height: 48,
            backgroundColor: "#E6E6E6",
            fontSize: 24,
            borderRadius: 4,
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "baseline",
          }}
          onClick={() => {
            setNewPlayerIcon(
              allIcons[Math.floor(Math.random() * allIcons.length)]
            );
          }}
        >
          {newPlayerIcon}
        </Box>
        <input
          style={{
            flex: 1,
            boxSizing: "border-box",
            backgroundColor: "#E6E6E6",
            border: "none",
            outline: "none",
            width: 48,
            height: 48,
            fontSize: 24,
            borderRadius: 4,
            padding: "4px 8px",
          }}
          onChange={(e) => {
            setNewPlayerName(e.target.value);
          }}
          value={newPlayerName}
        ></input>
        <SquareButton
          onClick={() => {
            const player = appState.players.createPlayer(
              newPlayerName,
              newPlayerIcon
            );
            togglePlayer(player.id);
            setNewPlayerIcon(
              allIcons[Math.floor(Math.random() * allIcons.length)]
            );
            setNewPlayerName("");
          }}
          disabled={newPlayerName === "" || newPlayerName.length > 10}
        >
          <img
            src={add_icon}
            alt=""
            className={
              newPlayerName === "" || newPlayerName.length > 10 ? "" : "invert"
            }
          />
        </SquareButton>
      </Box>
    </Modal>
  );
});
