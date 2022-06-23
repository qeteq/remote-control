import { AutomationApi } from './interfaces';
import { Vector } from '../types';

class Automation {
  private api: AutomationApi;

  constructor(api: AutomationApi) {
    this.api = api;
  }

  async moveMouseBy(vector: Vector) {
    const { x, y } = await this.api.getMousePosition();
    await this.api.moveMouseTo(x + vector.x, y + vector.y);
  }

  async moveMouseTo(vector: Vector) {
    await this.api.moveMouseTo(vector.x, vector.y);
  }

  async getMousePosition() {
    return this.api.getMousePosition();
  }

  async draw(startPoint: Vector, points: Vector[]) {
    const { x: sx, y: sy } = startPoint;

    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < points.length; i += 1) {
      const { x, y } = points[i];
      await this.api.moveMouseTo(sx + x, sy + y);
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
    if (this.api.dispose) {
      this.api.dispose();
    }
  }
}

export { Automation };
