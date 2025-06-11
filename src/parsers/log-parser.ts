import { readFileSync } from 'fs';

export abstract class LogParser<T> {
  protected filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  protected readFile(): string {
    return readFileSync(this.filePath, 'utf-8');
  }

  protected getLines(): string[] {
    return this.readFile().split('\n');
  }

  abstract parse(): T[];
}