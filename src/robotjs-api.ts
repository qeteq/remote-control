import Jimp from 'jimp';
import {
  moveMouse,
  getMousePos,
  mouseToggle,
  screen,
  getScreenSize,
} from 'robotjs';
import { sleep } from './util/sleep';

import type { RobotApi } from './robot';
import type { Px } from './types';

const MOUSE_MOVEMENT_DELAY_MS = 10;
const SCREENSHOT_WIDTH: Px = 200;
const SCREENSHOT_HEIGHT: Px = 200;

function minmax(min: number, value: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function bgrToRgb(b: Buffer): void {
  for (let i = 0, l = b.length; i < l; i += 4) {
    // eslint-disable-next-line no-param-reassign
    [b[i], b[i + 2]] = [b[i + 2], b[i]];
  }
}

async function captureScreen(): Promise<Buffer> {
  const { x: mouseX, y: mouseY } = getMousePos();
  const { width: screenWidth, height: screenHeight } = getScreenSize();
  const x = minmax(
    0,
    mouseX - SCREENSHOT_WIDTH / 2,
    screenWidth - SCREENSHOT_WIDTH
  );
  const y = minmax(
    0,
    mouseY - SCREENSHOT_HEIGHT / 2,
    screenHeight - SCREENSHOT_HEIGHT
  );
  const width = Math.min(SCREENSHOT_WIDTH, screenWidth);
  const height = Math.min(SCREENSHOT_HEIGHT, screenHeight);

  const bitmap = screen.capture(x, y, width, height);

  bgrToRgb(bitmap.image);

  const image = await Jimp.read({
    data: bitmap.image,
    width: bitmap.width,
    height: bitmap.height,
  } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

  const pngBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
  return pngBuffer;
}

const robotJsApi: RobotApi = {
  async moveMouse(x, y) {
    await sleep(MOUSE_MOVEMENT_DELAY_MS);
    return moveMouse(x, y);
  },
  async getMousePos() {
    return getMousePos();
  },
  async mouseToggle(down, button) {
    return mouseToggle(down, button);
  },
  captureScreen,
  dispose: () => Promise.resolve(),
};

export { robotJsApi };
