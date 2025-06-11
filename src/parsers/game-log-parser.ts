import { LogParser } from './log-parser';
import { GameResult } from '../interfaces/game-result.interface';

export class GameLogParser extends LogParser<GameResult> {
  private games: GameResult[] = [];
  private gameNumber = 1;
  private killCount = 0;

  constructor(filePath: string = './games.log') {
    super(filePath);
  }

  parse(): GameResult[] {
    this.resetState();
    const lines = this.getLines();
    
    const actionMap = new Map([
      ['InitGame:', () => this.handleInitGame()],
      ['Kill:', () => this.handleKill()],
      ['ShutdownGame:', () => this.handleShutdownGame()]
    ]);

    lines.forEach(line => {
      for (const [keyword, action] of actionMap) {
        if (line.includes(keyword)) {
          action();
          break;
        }
      }
    });

    return this.games;
  }

  private resetState(): void {
    this.games = [];
    this.gameNumber = 1;
    this.killCount = 0;
  }

  private handleInitGame(): void {
    if (this.gameNumber > 1) {
      this.games.push({
        game: `game_${this.gameNumber - 1}`,
        total_kills: this.killCount
      });
    }
    this.killCount = 0;
  }

  private handleKill(): void {
    this.killCount++;
  }

  private handleShutdownGame(): void {
    this.games.push({
      game: `game_${this.gameNumber}`,
      total_kills: this.killCount
    });
    this.gameNumber++;
    this.killCount = 0;
  }
}