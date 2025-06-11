import { LogParser } from './log-parser';
import { GameResult } from '../interfaces/game-result.interface';

export class GameLogParser extends LogParser<GameResult> {
  private static readonly INITIAL_GAME_NUMBER = 1;
  private static readonly INITIAL_KILL_COUNT = 0;
  private static readonly MINIMUM_GAME_NUMBER_FOR_PUSH = 1;
  private static readonly GAME_NUMBER_DECREMENT = 1;
  private static readonly KILL_INCREMENT = 1;
  private static readonly GAME_NUMBER_INCREMENT = 1;

  private games: GameResult[] = [];
  private gameNumber: number = GameLogParser.INITIAL_GAME_NUMBER;
  private killCount: number = GameLogParser.INITIAL_KILL_COUNT;

  constructor(filePath: string = './games.log') {
    super(filePath);
  }

  parse(): GameResult[] {
    this.resetState();
    const lines: string[] = this.getLines();
    
    const actionMap: Map<string, () => void> = new Map([
      ['InitGame:', (): void => this.handleInitGame()],
      ['Kill:', (): void => this.handleKill()],
      ['ShutdownGame:', (): void => this.handleShutdownGame()]
    ]);

    lines.forEach((line: string) => {
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
    this.gameNumber = GameLogParser.INITIAL_GAME_NUMBER;
    this.killCount = GameLogParser.INITIAL_KILL_COUNT;
  }

  private handleInitGame(): void {
    if (this.gameNumber > GameLogParser.MINIMUM_GAME_NUMBER_FOR_PUSH) {
      this.games.push({
        game: `game_${this.gameNumber - GameLogParser.GAME_NUMBER_DECREMENT}`,
        total_kills: this.killCount
      });
    }
    this.killCount = GameLogParser.INITIAL_KILL_COUNT;
  }

  private handleKill(): void {
    this.killCount += GameLogParser.KILL_INCREMENT;
  }

  private handleShutdownGame(): void {
    this.games.push({
      game: `game_${this.gameNumber}`,
      total_kills: this.killCount
    });
    this.gameNumber += GameLogParser.GAME_NUMBER_INCREMENT;
    this.killCount = GameLogParser.INITIAL_KILL_COUNT;
  }
}