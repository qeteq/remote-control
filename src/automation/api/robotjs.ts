import Jimp from 'jimp';
import {
  moveMouse,
  getMousePos,
  mouseToggle,
  screen,
  getScreenSize,
} from 'robotjs';

import type { AutomationApi } from '../interfaces';

const SMOOTH_SEGMENT_LENGTH = 10;
const SCREENSHOT_WIDTH = 200;
const SCREENSHOT_HEIGHT = 200;

function bgrToRgb(b: Buffer): void {
  for (let i = 0, l = b.length; i < l; i += 4) {
    // eslint-disable-next-line no-param-reassign
    [b[i], b[i + 2]] = [b[i + 2], b[i]];
  }
}

function minmax(min: number, value: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

async function captureScreen(): Promise<Buffer> {
  const { x: mouseX, y: mouseY } = getMousePos();
  const { width: screenWidth, height: screenHeight } = getScreenSize();

  const width = Math.min(SCREENSHOT_WIDTH, screenWidth);
  const height = Math.min(SCREENSHOT_HEIGHT, screenHeight);
  const x = minmax(
    0,
    mouseX - Math.floor(SCREENSHOT_WIDTH / 2),
    screenWidth - width
  );
  const y = minmax(
    0,
    mouseY - Math.floor(SCREENSHOT_HEIGHT / 2),
    screenHeight - height
  );

  const bitmap = screen.capture(x, y, width, height);
  const rawData = bitmap.image as Buffer;

  bgrToRgb(rawData);

  const image = await Jimp.read({
    data: rawData,
    width: bitmap.width,
    height: bitmap.height,
  });

  const pngBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
  return pngBuffer;
}

const robotjsApi: AutomationApi = {
  async moveMouseTo(x, y, smooth = false) {
    if (smooth) {
      const { x: sx, y: sy } = getMousePos();
      const dx = x - sx;
      const dy = y - sy;
      const length = Math.sqrt(dx ** 2 + dy ** 2);
      const steps = length / SMOOTH_SEGMENT_LENGTH;
      const intSteps = Math.floor(steps);
      for (let i = 0; i < intSteps; i += 1) {
        moveMouse(
          sx + (dx / intSteps) * (i + 1),
          sy + (dy / intSteps) * (i + 1)
        );
      }
      if (steps > intSteps) {
        moveMouse(x, y);
      }
    } else {
      moveMouse(x, y);
    }
  },
  async getMousePosition() {
    return getMousePos();
  },
  async mouseToggle(down, button) {
    return mouseToggle(down, button);
  },
  captureScreen,
};

export { robotjsApi };
