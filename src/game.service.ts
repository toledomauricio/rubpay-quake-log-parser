import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { GameResult } from './interfaces/game-result.interface';

@Injectable()
export class GameService {
  parseGames(): GameResult[] {
    const logContent: string = readFileSync('./games.log', 'utf-8');
    const lines: string[] = logContent.split('\n');
    
    const games: GameResult[] = [];
    let gameNumber: number = 1;
    let killCount: number = 0;
    
    for (const line of lines) {
      if (line.includes('InitGame:')) {
        if (gameNumber > 1) {
          games.push({
            game: `game_${gameNumber - 1}`,
            total_kills: killCount
          });
        }
        killCount = 0;
      }
      
      if (line.includes('Kill:')) {
        killCount++;
      }
      
      if (line.includes('ShutdownGame:')) {
        games.push({
          game: `game_${gameNumber}`,
          total_kills: killCount
        });
        gameNumber++;
        killCount = 0;
      }
    }
    
    return games;
  }

  getAllGames(): GameResult[] {
    return this.parseGames();
  }

  getGameById(gameId: string): GameResult | undefined {
    const games: GameResult[] = this.parseGames();
    return games.find((game: GameResult) => game.game === gameId);
  }
}