export interface GameResult {
  game: string;
  total_kills: number;
  kills_by_means: { [cause: string]: number };
  world_kills: number;
}