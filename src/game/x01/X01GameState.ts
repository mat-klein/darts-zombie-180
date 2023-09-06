import { makeAutoObservable } from "mobx";
import { GameState } from "../GameState";
import { DartHit, getHitScore } from "../../utils/darts";
import { X01GameCheckout } from "./X01GameCheckout";

type PlayerStat = {
  currentRoundScore: number;
  currentRoundHits: DartHit[];
  scoreRemaining: number;
  legs: number;
  sets: number;
  hits: DartHit[];
  currentLegScore: number;
  currentLegHits: DartHit[];
  currentSetScore: number;
  //currentSetHits: DartHit[];
  checkoutAttempts: DartHit[];
  totalLegsWon: number;
  totalScore: number;
};

const dartsPerRound = 3;

export type X01GameSettings = {
  startScore: number;
  doubleIn?: boolean;
  doubleOut?: boolean;
  legsToSet: number;
  setsToWin: number;
};

export const defaultSettings: X01GameSettings = {
  startScore: 501,
  doubleIn: false,
  doubleOut: true,
  legsToSet: 3,
  setsToWin: 1,
};

export class X01GameState implements GameState {
  gameCheckouts = new X01GameCheckout();
  currentPlayer: number = 0;
  players: string[] = [];
  playerStats: Record<string, PlayerStat> = {};
  gameEnded: boolean = false;
  currentDartsRemaining = dartsPerRound;
  settings: X01GameSettings;
  tellScore: number | undefined;
  allHits: DartHit[] = [];

  constructor(players: string[], settings: X01GameSettings = defaultSettings) {
    this.players = players;
    this.settings = settings;
    this.restart();
    makeAutoObservable(this);
  }

  getType(): string {
    return "x01";
  }

  getCurrentPlayer(): string {
    return this.players[this.currentPlayer];
  }

  getCurrentPlayerStats(): PlayerStat {
    return this.playerStats[this.getCurrentPlayer()];
  }

  getPlayerList(): string[] {
    return this.players;
  }

  getPlayerScore(playerId: string): number {
    return this.playerStats[playerId].scoreRemaining;
  }

  getPlayerStats(playerId: string): PlayerStat {
    return this.playerStats[playerId];
  }

  getDartsRemaining(): number {
    return this.currentDartsRemaining;
  }

  addSetWin(playerId: string) {
    this.playerStats[playerId].sets += 1;
    if (this.playerStats[playerId].sets >= this.settings.setsToWin) {
      this.gameEnded = true;
      console.log("gameEnded");
    }
    // reset legs
    this.players.forEach((pId) => {
      this.playerStats[pId].legs = 0;
      this.playerStats[pId].currentSetScore = 0;
    });
  }

  addLegWin(playerId: string) {
    this.playerStats[playerId].legs += 1;
    this.playerStats[playerId].totalLegsWon += 1;
    this.playerStats[playerId].currentLegScore = 0;
    // reset legs
    this.players.forEach((pId) => {
      this.playerStats[pId].currentLegScore = 0;
      this.playerStats[pId].currentLegHits = [];
    });
    if (this.playerStats[playerId].legs >= this.settings.legsToSet) {
      this.addSetWin(playerId);
    }
    if (!this.gameEnded) {
      this.resetScores();
    }
  }

  resetScores() {
    // reset scores
    this.players.forEach((pId) => {
      this.playerStats[pId].scoreRemaining = this.settings.startScore;
    });
  }

  processDartHit(hit: DartHit): void {
    this.allHits.push(hit);
    this.currentDartsRemaining--;
    const playerStats = this.getCurrentPlayerStats();
    playerStats.hits.push(hit);
    playerStats.currentRoundHits.push(hit);
    playerStats.currentLegHits.push(hit);
    //playerStats.currentSetHits.push(hit);
    const hitScore = getHitScore(hit);

    this.gameCheckouts.isCheckoutPossible(
      playerStats.scoreRemaining - playerStats.currentRoundScore,
      1
    ) &&
      playerStats.checkoutAttempts.push({
        number: hit.number,
        slicePart: hit.slicePart,
        targetExpected: {
          number:
            (playerStats.scoreRemaining - playerStats.currentRoundScore) / 2,
          slicePart: "double",
        },
      });

    if (
      (!this.settings.doubleIn ||
        playerStats.scoreRemaining - playerStats.currentRoundScore <
          this.settings.startScore ||
        hit.slicePart === "double") &&
      (!this.settings.doubleOut ||
        playerStats.scoreRemaining - playerStats.currentRoundScore - hitScore >
          1)
    ) {
      playerStats.currentRoundScore += hitScore;
    } else if (
      // bust
      playerStats.scoreRemaining - playerStats.currentRoundScore - hitScore <
      0
    ) {
      // no score
      playerStats.currentRoundScore = 0;
      this.currentDartsRemaining = 0;
    } else if (
      // bust with double out
      this.settings.doubleOut &&
      (playerStats.scoreRemaining - playerStats.currentRoundScore - hitScore ===
        1 ||
        (playerStats.scoreRemaining -
          playerStats.currentRoundScore -
          hitScore ===
          0 &&
          hit.slicePart !== "double"))
    ) {
      // no score
      playerStats.currentRoundScore = 0;
      this.currentDartsRemaining = 0;
    } else if (
      // won
      playerStats.scoreRemaining - playerStats.currentRoundScore - hitScore ===
      0
    ) {
      // no score
      playerStats.currentRoundScore += hitScore;
      this.currentDartsRemaining = 0;
    }

    if (this.currentDartsRemaining <= 0) {
      // round finished
      this.tellScore = playerStats.currentRoundScore;
      playerStats.scoreRemaining -= playerStats.currentRoundScore;
      playerStats.currentLegScore += playerStats.currentRoundScore;
      playerStats.currentSetScore += playerStats.currentRoundScore;
      playerStats.totalScore += playerStats.currentRoundScore;
      playerStats.currentRoundScore = 0;
      playerStats.currentRoundHits = [];
      if (playerStats.scoreRemaining <= 0) {
        // leg won
        this.addLegWin(this.getCurrentPlayer());
      }
      // next player
      this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
      this.currentDartsRemaining = dartsPerRound;
    }
  }

  undoDartHit(): void {
    const undoneHits = this.allHits.slice(0, -1);
    this.restart();
    undoneHits.forEach((hit) => this.processDartHit(hit));
    this.tellScore = undefined;
  }

  hasGameEnded(): boolean {
    return this.gameEnded;
  }

  getRanking(): string[] {
    return [...this.players].sort((a, b) => {
      const statsA = this.playerStats[a];
      const statsB = this.playerStats[b];
      return statsA.scoreRemaining - statsB.scoreRemaining;
    });
  }

  guessTarget(hit?: DartHit): DartHit {
    const playerStats = this.getCurrentPlayerStats();
    const score = playerStats.scoreRemaining - playerStats.currentRoundScore;
    if (score <= 40) {
      if (score % 2 === 0) {
        return { slicePart: "double", number: score / 2 };
      } else {
        return { slicePart: "outer", number: 1 };
      }
    }
    return { slicePart: "triple", number: 20 };
  }

  restart(): void {
    this.playerStats = {};
    this.players.forEach((playerId) => {
      this.playerStats[playerId] = {
        currentRoundScore: 0,
        currentRoundHits: [],
        scoreRemaining: this.settings.startScore,
        legs: 0,
        sets: 0,
        currentLegScore: 0,
        currentLegHits: [],
        currentSetScore: 0,
        //currentSetHits: [],
        checkoutAttempts: [],
        totalScore: 0,
        totalLegsWon: 0,
        hits: [],
      };
    });
    this.currentDartsRemaining = dartsPerRound;
    this.currentPlayer = 0;
    this.gameEnded = false;
    this.tellScore = undefined;
    this.allHits = [];
  }
}
