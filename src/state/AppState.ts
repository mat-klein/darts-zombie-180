import React from 'react';
import { GameState } from '../game/GameState';
import { ScreenState } from './ScreenState';
import { makeAutoObservable } from 'mobx';
import { PlayersState } from './PlayersState';

export class AppState {
  screen = new ScreenState();
  players = new PlayersState();
  //userSession: UserSessionState = new UserSessionState();
  gameState?: GameState = undefined;
  soundState?: boolean = false;
  distributionState?: boolean = false;

  constructor() {
    makeAutoObservable(this, {});
  }

  newGame(gameState: GameState) {
    this.gameState = gameState;
  }
}

export const AppContext = React.createContext<AppState>(
  new AppState()
);
