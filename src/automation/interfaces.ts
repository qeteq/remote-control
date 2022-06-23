import { Vector, Px } from '../types';

export interface AutomationApi {
  moveMouseTo(x: Px, y: Px, smooth?: boolean): Promise<void>;
  getMousePosition(): Promise<Vector>;
  mouseToggle(
    down: 'down' | 'up',
    button: 'left' | 'right' | 'middle'
  ): Promise<void>;
  captureScreen(
    x?: number,
    y?: number,
    width?: number,
    height?: number
  ): Promise<Buffer>;
  dispose?(): void;
}
