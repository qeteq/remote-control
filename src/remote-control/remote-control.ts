import type { Input } from '../input';
import type { Output } from '../output';
import type { Automation } from '../automation';
import type { Px, Vector } from '../types';

interface RemoteControlConfig {
  input: Input;
  output: Output;
  automation: Automation;
}

const CIRCLE_SEGMENTS = 90;

const logError =
  <TArgs extends unknown[]>(fn: (...args: TArgs) => Promise<void>) =>
  (...args: TArgs) => {
    fn(...args).catch((error) => {
      console.error(error);
    });
  };

class RemoteControl {
  private input: Input;

  private output: Output;

  private automation: Automation;

  constructor(config: RemoteControlConfig) {
    this.input = config.input;
    this.output = config.output;
    this.automation = config.automation;

    this.input.on('mouse_up', this.mouseUp);
    this.input.on('mouse_down', this.mouseDown);
    this.input.on('mouse_left', this.mouseLeft);
    this.input.on('mouse_right', this.mouseRight);
    this.input.on('draw_rectangle', this.drawRect);
    this.input.on('draw_square', this.drawSquare);
    this.input.on('draw_circle', this.drawCircle);
    this.input.on('prnt_scrn', this.sendScreenshot);
    this.input.on('mouse_position', this.sendMousePosition);
  }

  mouseUp = logError(async (dist: Px) => {
    await this.automation.moveMouseBy({ x: 0, y: -dist });
  });

  mouseDown = logError(async (dist: Px) => {
    await this.automation.moveMouseBy({ x: 0, y: dist });
  });

  mouseLeft = logError(async (dist: Px) => {
    await this.automation.moveMouseBy({ x: -dist, y: 0 });
  });

  mouseRight = logError(async (dist: Px) => {
    await this.automation.moveMouseBy({ x: dist, y: 0 });
  });

  drawRect = logError(async (width: Px, height: Px) => {
    const center = await this.automation.getMousePosition();
    const startPoint = {
      x: center.x - Math.round(width / 2),
      y: center.y - Math.round(height / 2),
    };

    await this.automation.draw(startPoint, [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: height },
      { x: 0, y: height },
      { x: 0, y: 0 },
    ]);
    await this.automation.moveMouseTo(center);
  });

  drawSquare = (size: Px) => this.drawRect(size, size);

  drawCircle = logError(async (radius: Px, mx: Px = 1, my: Px = 1) => {
    const center = await this.automation.getMousePosition();
    const segments = CIRCLE_SEGMENTS;
    const points = new Array<Vector>(segments + 1);
    for (let i = 0; i <= segments; i += 1) {
      const angle = (i * 2 * Math.PI) / segments;
      points[i] = {
        x: Math.round(radius * Math.cos(angle * mx)),
        y: Math.round(radius * Math.sin(angle * my)),
      };
    }
    await this.automation.draw(center, points);
    await this.automation.moveMouseTo(center);
  });

  sendMousePosition = logError(async () => {
    const position = await this.automation.getMousePosition();
    await this.output.sendMousePosition(position);
  });

  sendScreenshot = logError(async () => {
    const buffer = await this.automation.takeScreenshot();
    await this.output.sendScreenshot(buffer);
  });

  dispose() {
    this.input.off('mouse_up', this.mouseUp);
    this.input.off('mouse_down', this.mouseDown);
    this.input.off('mouse_left', this.mouseLeft);
    this.input.off('mouse_right', this.mouseRight);
    this.input.off('draw_rectangle', this.drawRect);
    this.input.off('draw_square', this.drawSquare);
    this.input.off('draw_circle', this.drawCircle);
    this.input.off('prnt_scrn', this.sendScreenshot);
    this.input.off('mouse_position', this.sendMousePosition);
  }
}

export { RemoteControl };
