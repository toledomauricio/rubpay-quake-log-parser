import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  getAllGames() {
    return this.gameService.getAllGames();
  }

  @Get(':gameId')
  getGame(@Param('gameId') gameId: string) {
    const game = this.gameService.getGameById(gameId);
    
    if (!game) {
      throw new NotFoundException(`Game ${gameId} not found`);
    }
    
    return game;
  }
}