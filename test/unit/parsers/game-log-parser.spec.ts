import { GameLogParser } from '../../../src/parsers/game-log-parser';
import { GameResult } from '../../../src/interfaces/game-result.interface';
import * as fs from 'fs';

// Mock do módulo fs
jest.mock('fs');
const mockReadFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>;

describe('GameLogParser', () => {
  let gameLogParser: GameLogParser;
  const testFilePath = './test-games.log';

  beforeEach(() => {
    gameLogParser = new GameLogParser(testFilePath);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with default file path', () => {
      const parser = new GameLogParser();
      expect(parser).toBeInstanceOf(GameLogParser);
    });
  });

  describe('parse', () => {
    it('should parse single game', () => {
      const mockLogContent = `
  0:00 InitGame: \\sv_floodProtect\\1\\sv_maxPing\\0
 20:34 Kill: 1022 2 22: <world> killed Isgalamido by MOD_TRIGGER_HURT
 20:54 Kill: 1 2 7: Isgalamido killed Mocinha by MOD_ROCKET_SPLASH
 21:07 ShutdownGame:
`;
      mockReadFileSync.mockReturnValue(mockLogContent);
      
      const result = gameLogParser.parse();
      
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        game: 'game_1',
        total_kills: 2,
        kills_by_means: {
          'MOD_TRIGGER_HURT': 1,
          'MOD_ROCKET_SPLASH': 1
        },
        world_kills: 1
      });
    });

    it('should handle world kills correctly', () => {
      const mockLogContent = `
  0:00 InitGame: \\sv_floodProtect\\1
 20:34 Kill: 1022 2 22: <world> killed Player1 by MOD_TRIGGER_HURT
 20:35 Kill: 1022 3 22: <world> killed Player2 by MOD_FALLING
 21:07 ShutdownGame:
`;
      mockReadFileSync.mockReturnValue(mockLogContent);
      
      const result = gameLogParser.parse();
      
      expect(result[0].world_kills).toBe(2);
      expect(result[0].total_kills).toBe(2);
    });

    it('should count kills by means', () => {
      const mockLogContent = `
  0:00 InitGame: \\sv_floodProtect\\1
 20:34 Kill: 1 2 7: Player1 killed Player2 by MOD_ROCKET
 20:35 Kill: 1 3 7: Player1 killed Player3 by MOD_ROCKET
 20:36 Kill: 2 1 22: Player2 killed Player1 by MOD_TRIGGER_HURT
 21:07 ShutdownGame:
`;
      mockReadFileSync.mockReturnValue(mockLogContent);
      
      const result = gameLogParser.parse();
      
      expect(result[0].kills_by_means).toEqual({
        'MOD_ROCKET': 2,
        'MOD_TRIGGER_HURT': 1
      });
    });
  });
});