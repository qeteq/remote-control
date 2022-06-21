import { Readable } from 'stream';
import { Px, Vector } from './types';

interface RobotApi {
  moveMouse(x: Px, y: Px): void;
  getMousePos(): Vector;
  mouseToggle(down: 'down' | 'up', button: 'left' | 'right' | 'middle'): void;
  dispose(): void;
}

class Robot {
  private api: RobotApi;

  constructor(api: RobotApi) {
    this.api = api;
  }

  moveMouseBy(vector: Vector) {
    const { x, y } = this.api.getMousePos();
    this.api.moveMouse(x + vector.x, y + vector.y);
  }

  moveMouseTo(vector: Vector): void {
    this.api.moveMouse(vector.x, vector.y);
  }

  getMousePosition(): Vector {
    return this.api.getMousePos();
  }

  draw(startPoint: Vector, points: Vector[]): void {
    const { x: sx, y: sy } = startPoint;
    points.forEach(({ x, y }, i, { length }) => {
      this.api.moveMouse(sx + x, sy + y);
      if (i === 0) {
        this.api.mouseToggle('down', 'left');
      } else if (i === length - 1) {
        this.api.mouseToggle('up', 'left');
      }
    });
  }

  takeScreenshot(): Readable {
    return null as any;
  }

  dispose(): void {
    this.api.dispose();
  }
}

export { Robot };
export type { RobotApi };
