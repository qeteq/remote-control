import type { Robot } from './robot';
import type { RobotIo } from './io/robot-io';
import type { Px } from './types';

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

  mouseUp = (dist: Px) => {
    this.robot.moveMouseBy({ x: 0, y: -dist });
  };

  mouseDown = (dist: Px) => {
    this.robot.moveMouseBy({ x: 0, y: dist });
  };

  mouseLeft = (dist: Px) => {
    this.robot.moveMouseBy({ x: -dist, y: 0 });
  };

  mouseRight = (dist: Px) => {
    this.robot.moveMouseBy({ x: dist, y: 0 });
  };

  drawRect = (width: Px, height: Px) => {
    const center = this.robot.getMousePosition();
    const startPoint = {
      x: center.x - Math.round(width / 2),
      y: center.y - Math.round(height / 2),
    };

    this.robot.draw(startPoint, [
      { x: 0, y: 0 },
      { x: width, y: 0 },
      { x: width, y: height },
      { x: 0, y: height },
      { x: 0, y: 0 },
    ]);
    this.robot.moveMouseTo(center);
  };

  drawSquare = (size: Px) => this.drawRect(size, size);

  drawCircle = (radius: Px) => {
    console.error('draw_circle not implemented');
    this.io.send(Buffer.from(String(radius)));
  };

  takeScreenshot = () => {
    // const stream = this.robot.takeScreenshot();
    console.error('prnt_scrn not implemented');
  };

  sendMousePosition = () => {
    const { x, y } = this.robot.getMousePosition();
    this.io.send(`mouse_position ${x},${y}`);
  };

  dispose() {
    this.io.dispose();
    this.robot.dispose();
  }
}

export { Rc };
