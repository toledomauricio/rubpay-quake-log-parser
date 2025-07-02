import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { GameService } from '../../src/game.service';
import { GameResult } from '../../src/interfaces/game-result.interface';

describe('GameController (e2e)', () => {
  let app: INestApplication;
  let gameService: GameService;

  const mockGameResults: GameResult[] = [
    {
      game: 'game_1',
      total_kills: 11,
      kills_by_means: {
        'MOD_TRIGGER_HURT': 7,
        'MOD_ROCKET_SPLASH': 3,
        'MOD_FALLING': 1
      },
      world_kills: 7
    },
    {
      game: 'game_2',
      total_kills: 4,
      kills_by_means: {
        'MOD_TRIGGER_HURT': 2,
        'MOD_ROCKET': 2
      },
      world_kills: 2
    }
  ];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(GameService)
    .useValue({
      getAllGames: jest.fn().mockReturnValue(mockGameResults),
      getGameById: jest.fn().mockImplementation((gameId: string) => {
        return mockGameResults.find(game => game.game === gameId);
      })
    })
    .compile();

    app = moduleFixture.createNestApplication();
    gameService = moduleFixture.get<GameService>(GameService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /games', () => {
    it('should return all games', async () => {
      const response = await request(app.getHttpServer())
        .get('/games')
        .expect(200);

      expect(response.body).toEqual(mockGameResults);
      expect(response.body).toHaveLength(2);
      expect(gameService.getAllGames).toHaveBeenCalled();
    });

    it('should return games with correct structure', async () => {
      const response = await request(app.getHttpServer())
        .get('/games')
        .expect(200);

      response.body.forEach((game: GameResult) => {
        expect(game).toHaveProperty('game');
        expect(game).toHaveProperty('total_kills');
        expect(game).toHaveProperty('kills_by_means');
        expect(game).toHaveProperty('world_kills');
        expect(typeof game.game).toBe('string');
        expect(typeof game.total_kills).toBe('number');
        expect(typeof game.world_kills).toBe('number');
        expect(typeof game.kills_by_means).toBe('object');
      });
    });
  });

  describe('GET /games/:gameId', () => {
    it('should return specific game', async () => {
      const gameId = 'game_1';
      const response = await request(app.getHttpServer())
        .get(`/games/${gameId}`)
        .expect(200);

      expect(response.body).toEqual(mockGameResults[0]);
      expect(response.body.game).toBe(gameId);
      expect(gameService.getGameById).toHaveBeenCalledWith(gameId);
    });
  });
});