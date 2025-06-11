import { Injectable } from '@nestjs/common';
import { GameResult } from './interfaces/game-result.interface';
import { GameLogParser } from './parsers/game-log-parser';

@Injectable()
export class GameService {
  private gameLogParser: GameLogParser;

  constructor() {
    this.gameLogParser = new GameLogParser('./games.log');
  }

  parseGames(): GameResult[] {
    return this.gameLogParser.parse();
  }

  getAllGames(): GameResult[] {
    return this.parseGames();
  }

  getGameById(gameId: string): GameResult | undefined {
    const games: GameResult[] = this.parseGames();
    return games.find((game: GameResult) => game.game === gameId);
  }
}