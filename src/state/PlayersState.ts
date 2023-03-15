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
    this.load();
    /*
    this.createPlayer('Tobias', '🧬');
    this.createPlayer('Raphael', '🌊');
    this.createPlayer('Nico', '🥎');
    this.createPlayer('Philipp', '🎱');
    */

    makeAutoObservable(this);
  }

  createPlayer(name: string, icon?: string): PlayerData {
    const player = {
      id: uuidv4(),
      name,
      icon,
    };
    this.players[player.id] = player;
    this.save();
    return this.players[player.id];
  }

  deletePlayer(playerId: string): void {
    delete this.players[playerId];
    this.save();
  }

  load() {
    const playersStr = localStorage.getItem('players.players');
    this.players = {};
    if (playersStr) {
      this.players = JSON.parse(playersStr);
    }
  }

  save() {
    localStorage.setItem(
      'players.players',
      JSON.stringify(this.players)
    );
  }
}
