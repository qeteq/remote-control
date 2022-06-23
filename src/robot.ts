import { Px, Vector } from './types';

interface RobotApi {
  moveMouse(x: Px, y: Px): Promise<void>;
  getMousePos(): Promise<Vector>;
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
  dispose(): void;
}

class Robot {
  private api: RobotApi;

  constructor(api: RobotApi) {
    this.api = api;
  }

  async moveMouseBy(vector: Vector) {
    const { x, y } = await this.api.getMousePos();
    await this.api.moveMouse(x + vector.x, y + vector.y);
  }

  async moveMouseTo(vector: Vector) {
    await this.api.moveMouse(vector.x, vector.y);
  }

  async getMousePosition() {
    return this.api.getMousePos();
  }

  async draw(startPoint: Vector, points: Vector[]) {
    const { x: sx, y: sy } = startPoint;
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < points.length; i += 1) {
      const { x, y } = points[i];
      await this.api.moveMouse(sx + x, sy + y);
      if (i === 0) {
        await this.api.mouseToggle('down', 'left');
      } else if (i === points.length - 1) {
        await this.api.mouseToggle('up', 'left');
      }
    }
    /* eslint-enable no-await-in-loop */
  }

  async takeScreenshot() {
    return this.api.captureScreen();
  }

  dispose() {
    this.api.dispose();
  }
}

export { Robot };
export type { RobotApi };
