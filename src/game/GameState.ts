import { DartHit } from '../utils/darts';

export interface GameState {
  restart(): void;
  getType(): string;
  getCurrentPlayer(): string;
  getPlayerList(): string[];
  getPlayerScore(playerId: string): number;
  getDartsRemaining(): number;
  processDartHit(hit: DartHit): void;
  undoDartHit(): void;
  hasGameEnded(): boolean;
  getRanking(): string[];
  guessTarget(hit?: DartHit): DartHit;
}
