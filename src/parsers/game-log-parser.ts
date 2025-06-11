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
  private killsByMeans: { [cause: string]: number } = {};
  private worldKills: number = 0;

  constructor(filePath: string = './games.log') {
    super(filePath);
  }

  parse(): GameResult[] {
    this.resetState();
    const lines: string[] = this.getLines();
    
    const actionMap: Map<string, (line: string) => void> = new Map([
      ['InitGame:', (line: string): void => this.handleInitGame()],
      ['Kill:', (line: string): void => this.handleKill(line)],
      ['ShutdownGame:', (line: string): void => this.handleShutdownGame()]
    ]);

    lines.forEach((line: string) => {
      for (const [keyword, action] of actionMap) {
        if (line.includes(keyword)) {
          action(line);
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
    this.killsByMeans = {};
    this.worldKills = 0;
  }

  private handleInitGame(): void {
    if (this.gameNumber > GameLogParser.MINIMUM_GAME_NUMBER_FOR_PUSH) {
      this.games.push({
        game: `game_${this.gameNumber - GameLogParser.GAME_NUMBER_DECREMENT}`,
        total_kills: this.killCount,
        kills_by_means: { ...this.killsByMeans },
        world_kills: this.worldKills
      });
    }
    this.killCount = GameLogParser.INITIAL_KILL_COUNT;
    this.killsByMeans = {};
    this.worldKills = 0;
  }

  private handleKill(line: string): void {
    this.killCount += GameLogParser.KILL_INCREMENT;
    
    //Format: Kill: <killer_id> <victim_id> <means_id>: <killer> killed <victim> by <means>
    const killMatch = line.match(/Kill:\s*\d+\s+\d+\s+\d+:\s*(.+?)\s+killed\s+(.+?)\s+by\s+(.+)/);
    
    if (killMatch) {
      const [, killer, victim, means] = killMatch;
      this.killsByMeans[means] = (this.killsByMeans[means] || 0) + 1;

      if (killer === '<world>') {
        this.worldKills += 1;
      }
    }
  }

  private handleShutdownGame(): void {
    this.games.push({
      game: `game_${this.gameNumber}`,
      total_kills: this.killCount,
      kills_by_means: { ...this.killsByMeans },
      world_kills: this.worldKills
    });
    this.gameNumber += GameLogParser.GAME_NUMBER_INCREMENT;
    this.killCount = GameLogParser.INITIAL_KILL_COUNT;
    this.killsByMeans = {};
    this.worldKills = 0;
  }
}