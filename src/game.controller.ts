import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { GameService } from './game.service';
import { GameResult } from './interfaces/game-result.interface';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  getAllGames(): GameResult[] {
    return this.gameService.getAllGames();
  }

  @Get(':gameId')
  getGame(@Param('gameId') gameId: string): GameResult {
    const game: GameResult | undefined = this.gameService.getGameById(gameId);
    
    if (!game) {
      throw new NotFoundException(`Game ${gameId} not found`);
    }
    
    return game;
  }
}