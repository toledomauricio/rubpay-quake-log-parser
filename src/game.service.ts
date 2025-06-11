import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

@Injectable()
export class GameService {
  parseGames() {
    const logContent = readFileSync('./games.log', 'utf-8');
  }
}