import type { Robot } from '../robot';
import type { RobotIo } from '../io';
import type { Px } from '../types';

class Rc {
  private io: RobotIo;

  private robot: Robot;

  constructor(robotIo: RobotIo, robot: Robot) {
    this.io = robotIo;
    this.robot = robot;

    this.io.on('mouse_up', this.mouseUp);
    this.io.on('mouse_down', this.mouseDown);
    this.io.on('mouse_left', this.mouseLeft);
    this.io.on('mouse_right', this.mouseRight);
    this.io.on('draw_rectangle', this.drawRect);
    this.io.on('draw_square', this.drawSquare);
    this.io.on('draw_circle', this.drawCircle);
    this.io.on('prnt_scrn', this.takeScreenshot);
    this.io.on('mouse_position', this.sendMousePosition);
  }

  mouseUp = async (dist: Px) => {
    await this.robot.moveMouseBy({ x: 0, y: -dist });
  };

  mouseDown = async (dist: Px) => {
    await this.robot.moveMouseBy({ x: 0, y: dist });
  };

  mouseLeft = async (dist: Px) => {
    await this.robot.moveMouseBy({ x: -dist, y: 0 });
  };

  mouseRight = async (dist: Px) => {
    await this.robot.moveMouseBy({ x: dist, y: 0 });
  };

  drawRect = async (width: Px, height: Px) => {
    const center = await this.robot.getMousePosition();
    const startPoint = {
      x: center.x - Math.round(width / 2),
      y: center.y - Math.round(height / 2),
    };

    await this.robot.draw(startPoint, [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: height },
      { x: 0, y: height },
      { x: 0, y: 0 },
    ]);
    await this.robot.moveMouseTo(center);
  };

  drawSquare = (size: Px) => this.drawRect(size, size);

  drawCircle = async (radius: Px, mx: Px = 1, my: Px = 1) => {
    const center = await this.robot.getMousePosition();
    const segments = 360;
    const points = new Array(segments + 1);
    for (let i = 0; i <= segments; i += 1) {
      const angle = (i * 2 * Math.PI) / segments;
      points[i] = {
        x: Math.round(radius * Math.cos(angle * mx)),
        y: Math.round(radius * Math.sin(angle * my)),
      };
    }
    await this.robot.draw(center, points);
    await this.robot.moveMouseTo(center);
  };

  takeScreenshot = async () => {
    const buffer = await this.robot.takeScreenshot();
    this.io.sendScreenshot(buffer);
  };

  sendMousePosition = async () => {
    const position = await this.robot.getMousePosition();
    this.io.sendMousePosition(position);
  };

  async dispose() {
    await this.io.dispose();
    await this.robot.dispose();
  }
}

export { Rc };
