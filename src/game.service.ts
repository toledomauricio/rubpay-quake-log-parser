import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

@Injectable()
export class GameService {
  parseGames() {
    const logContent = readFileSync('./games.log', 'utf-8');
    const lines = logContent.split('\n');
    
    const games = [];
    let gameNumber = 1;
    let killCount = 0;
    
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

  getAllGames() {
    return this.parseGames();
  }

  getGameById(gameId: string) {
    const games = this.parseGames();
    return games.find(game => game.game === gameId);
  }
}