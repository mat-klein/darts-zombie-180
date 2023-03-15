import {
  InputHTMLAttributes,
  useContext,
  useRef,
  useState,
} from 'react';
import { MenuButton } from '../components/ui/MenuButton';
import { MenuHeader } from '../components/ui/MenuHeader';
import Modal from '../components/ui/Modal';
import { AppContext } from '../state/AppState';
import { observer } from 'mobx-react-lite';
import Box from '../components/ui/Box';
import { SquareButton } from '../components/ui/SquareButton';
import { X01GameState } from '../game/x01/X01GameState';

export const allIcons = [
  ...'🔱🔴🟠🟡🟢🔵🟣🟤🟥🟧🟨🟩🟦🟪🟫🔶🔷🚩🎌🏳️‍🌈🏳️‍⚧️🏴‍☠️⛄💀🤡👾👻😸💞🔥🌊⚡⛱🌈🌀🎀🎋🎎🎃🎄🧨🧧🎀⚽🥎🏀🏐🏈🎾🥏🎳🏓🥊⛸🎣🪀🎱🔮🕹🎰🎲🧩🧸🪩🪆🎭🖼🪢🛍👑👒🧢💄💍💎🎸🎷🎻🥁🧮🏮💰🪃🏹🛡🪚🧰🧬🔭🩻🛋🪤🗿',
];

export type PlayerSelectScreenProps = {};

export const PlayerSelectScreen = observer(
  ({}: PlayerSelectScreenProps) => {
    const appState = useContext(AppContext);

    const [players, setPlayers] = useState<string[]>([]);
    const [newPlayerIcon, setNewPlayerIcon] = useState(
      allIcons[Math.floor(Math.random() * allIcons.length)]
    );
    const [newPlayerName, setNewPlayerName] = useState('');

    function start() {
      setPlayers((players) => {
        const game = new X01GameState(players);
        appState.newGame(game);
        return players;
      });
      appState.screen.changeRoute('game');
    }

    function togglePlayer(playerId: string) {
      setPlayers((players) => {
        if (players.indexOf(playerId) !== -1) {
          return players.filter((id) => id !== playerId);
        }
        return [...players, playerId];
      });
    }

    return (
      <Modal hideClose>
        <MenuHeader>Select players</MenuHeader>
        <Box
          flexDirection="row"
          gap={8}
          alignItems="center"
          style={{ flexWrap: 'wrap' }}
        >
          <div>Selected players:</div>
          {players.map((id) => (
            <Box
              key={id}
              padding="4px 8px"
              style={{
                backgroundColor: 'rgba(224,224,187,0.9)',
                borderRadius: 4,
              }}
              onClick={() => togglePlayer(id)}
            >
              {appState.players.players[id].icon}{' '}
              {appState.players.players[id].name}&nbsp;&nbsp;✖
            </Box>
          ))}
        </Box>
        <Box gap={8}>
          {Object.entries(appState.players.players)
            .filter(
              ([id, player]) => players.indexOf(player.id) === -1
            )
            .map(([id, player]) => (
              <Box
                key={id}
                padding="8px"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                style={{
                  backgroundColor: 'rgba(220, 220, 220, 0.5)',
                  borderRadius: 8,
                }}
              >
                <Box>
                  {player.icon} {player.name}
                </Box>
                <Box flexDirection="row" gap={12}>
                  <SquareButton
                    size="small"
                    onClick={() => togglePlayer(player.id)}
                  >
                    +
                  </SquareButton>
                  <SquareButton
                    size="small"
                    onClick={() => {
                      appState.players.deletePlayer(player.id);
                    }}
                  >
                    🗑
                  </SquareButton>
                </Box>
              </Box>
            ))}
        </Box>
        <div>New Player:</div>
        <Box
          padding="8px"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          gap={8}
          style={{
            backgroundColor: 'rgba(220, 220, 220, 0.5)',
            borderRadius: 8,
          }}
        >
          <Box
            style={{
              flex: '0 0 48px',
              height: 48,
              backgroundColor: 'rgba(150, 150, 150, 0.5)',
              fontSize: 16,
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
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
              boxSizing: 'border-box',
              backgroundColor: 'rgba(150, 150, 150, 0.5)',
              border: 'none',
              outline: 'none',
              width: 48,
              height: 48,
              fontSize: 24,
              borderRadius: 8,
              padding: '4px 8px',
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
              setNewPlayerName('');
            }}
            disabled={newPlayerName === ''}
          >
            +
          </SquareButton>
        </Box>
        <MenuButton onClick={start} disabled={players.length <= 0}>
          Start game
        </MenuButton>
      </Modal>
    );
  }
);
