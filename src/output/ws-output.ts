import { WebSocket } from 'ws';
import { once } from 'events';

import type { Output } from './interfaces';
import type { Vector } from '../types';

type SendOptions = Partial<{
  mask: boolean;
  binary: boolean;
  compress: boolean;
  fin: boolean;
}>;

class WebSocketOutput implements Output {
  private socket: WebSocket;

  constructor(socket: WebSocket) {
    this.socket = socket;
  }

  async sendMousePosition({ x, y }: Vector) {
    await this.send(`mouse_position ${x},${y}`);
  }

  async sendScreenshot(data: Buffer) {
    const b64 = data.toString('base64');
    await this.send(`prnt_scrn ${b64}`);
  }

  private async send(data: string | Buffer, options: SendOptions = {}) {
    if (this.socket.readyState === WebSocket.CONNECTING) {
      await once(this.socket, 'open');
    }

    if (this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      this.socket.send(data, options, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export { WebSocketOutput };
