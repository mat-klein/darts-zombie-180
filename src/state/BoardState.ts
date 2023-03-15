import { makeAutoObservable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';

type PlayerData = {
  id: string;
  name: string;
  icon?: string;
};

export class PlayersState {
  players: Record<string, PlayerData> = {};

  constructor() {
    makeAutoObservable(this);
  }

  createPlayer(name: string, icon?: string): PlayerData {
    const player = {
      id: uuidv4(),
      name,
      icon,
    };
    this.players[player.id] = player;
    return this.players[player.id];
  }
}
