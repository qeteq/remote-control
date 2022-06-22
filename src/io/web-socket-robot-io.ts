import { WebSocket } from 'ws';
import { once } from 'events';
import assert from 'assert';
import type { Readable } from 'stream';
import type { RawData } from 'ws';

import { RobotIo, isCommand } from './robot-io';
import { Vector } from '../types';

type SendOptions = Partial<{
  mask: boolean;
  binary: boolean;
  compress: boolean;
  fin: boolean;
}>;

class WebSocketRobotIo extends RobotIo {
  private socket: WebSocket;

  private queue: Array<string | Buffer | Readable>;

  private isProcessing = false;

  constructor(client: WebSocket) {
    super();
    this.socket = client;
    this.queue = [];

    this.socket.on('message', this.handleMessage);
    this.socket.once('error', this.handleError);
    this.socket.once('close', this.dispose);
  }

  sendMousePosition({ x, y }: Vector): void {
    this.queue.push(`mouse_position ${x},${y}`);
    this.processQueue();
  }

  sendScreenshot(data: Buffer): void {
    const b64 = data.toString('base64');
    this.queue.push(`prnt_scrn ${b64}`);
    this.processQueue();
  }

  dispose = async () => {
    this.socket.off('message', this.handleMessage);
    const { readyState } = this.socket;
    if (readyState === WebSocket.CONNECTING || readyState === WebSocket.OPEN) {
      this.socket.terminate();
    }
  };

  private async send(data: string | Buffer, options: SendOptions) {
    assert(
      this.socket.readyState !== WebSocket.CONNECTING,
      'sendChunk is called after socket has been connected'
    );

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

  private async processQueue() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    if (this.socket.readyState === WebSocket.CONNECTING) {
      await once(this.socket, 'open');
    }

    /* eslint-disable no-await-in-loop */
    while (this.queue.length) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const data = this.queue.shift()!;
      if (typeof data === 'string' || Buffer.isBuffer(data)) {
        await this.send(data, {});
      } else {
        for await (const chunk of data) {
          await this.send(chunk, {});
        }
        this.socket.send('\x00');
      }
    }
    /* eslint-enable no-await-in-loop */

    this.isProcessing = false;
  }

  private handleMessage = (data: RawData) => {
    const msg = data.toString('utf8');
    const args = msg.split(' ');
    const cmd = args.shift();
    if (!isCommand(cmd)) {
      return;
    }

    switch (cmd) {
      // 0 args
      case 'prnt_scrn':
      case 'mouse_position': {
        this.emit(cmd);
        break;
      }

      // 1 arg
      case 'mouse_up':
      case 'mouse_down':
      case 'mouse_left':
      case 'mouse_right':
      case 'draw_circle':
      case 'draw_square': {
        const [px] = args.map(Number);
        if (!Number.isNaN(px)) {
          this.emit(cmd, px);
        }
        break;
      }

      // 2 args
      case 'draw_rectangle': {
        const [px1, px2] = args.map(Number);
        if (!Number.isNaN(px1) && !Number.isNaN(px2)) {
          this.emit(cmd, px1, px2);
        }
        break;
      }

      default: {
        break;
      }
    }
  };

  private handleError = (error: Error) => {
    console.error(error);
    this.dispose();
  };
}

export { WebSocketRobotIo };
