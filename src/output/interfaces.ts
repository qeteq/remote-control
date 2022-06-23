import { Readable } from 'stream';
import { Vector } from '../types';

interface Output {
  sendMousePosition(coords: Vector): Promise<void>;
  sendScreenshot(data: Buffer | Readable): Promise<void>;
  dispose?(): void;
}

export type { Output };
