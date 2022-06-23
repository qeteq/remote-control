import Jimp from 'jimp';
import {
  moveMouse,
  getMousePos,
  mouseToggle,
  screen,
  getScreenSize,
} from 'robotjs';

import { sleep } from '../../util';

import type { AutomationApi } from '../interfaces';

const MOUSE_MOVEMENT_DELAY_MS = 10;
const SCREENSHOT_WIDTH = 200;
const SCREENSHOT_HEIGHT = 200;

function bgrToRgb(b: Buffer): void {
  for (let i = 0, l = b.length; i < l; i += 4) {
    // eslint-disable-next-line no-param-reassign
    [b[i], b[i + 2]] = [b[i + 2], b[i]];
  }
}

async function captureScreen(): Promise<Buffer> {
  const { x: mouseX, y: mouseY } = getMousePos();
  const { width: screenWidth, height: screenHeight } = getScreenSize();

  const x = mouseX;
  const y = mouseY;
  const width = Math.min(SCREENSHOT_WIDTH, screenWidth);
  const height = Math.min(SCREENSHOT_HEIGHT, screenHeight);

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
  async moveMouseTo(x, y) {
    await sleep(MOUSE_MOVEMENT_DELAY_MS);
    moveMouse(x, y);
  },
  async getMousePosition() {
    return getMousePos();
  },
  async mouseToggle(down, button) {
    return mouseToggle(down, button);
  },
  captureScreen,
  dispose: () => {},
};

export { robotjsApi };
