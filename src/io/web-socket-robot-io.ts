import { promisify } from 'util';
import { WebSocket } from 'ws';
import { RobotIo, isCommand } from './robot-io';

import type { Readable } from 'stream';
import type { RawData } from 'ws';
import { once } from 'events';
import assert from 'assert';

type SendOptions = Partial<{
  mask: boolean;
  binary: boolean;
  compress: boolean;
  fin: boolean;
}>;

class WebSocketRobotIo extends RobotIo {
  private socket: WebSocket;
  private queue: Array<string | Buffer | Readable>;
  private isProcessing: boolean = false;
  private asyncSend: (data: any, options?: SendOptions) => Promise<void>;

  constructor(client: WebSocket) {
    super();
    this.socket = client;
    this.queue = [];
    this.asyncSend = promisify(client.send).bind(client) as any;

    this.socket.on('message', this.handleMessage);
    this.socket.once('error', this.handleError);
    this.socket.once('close', this.dispose);
  }

  send(data: Buffer | string | Readable): void {
    this.queue.push(data);
    this.processQueue();
  }

  stream(stream: Readable): void {
    this.queue.push(stream);
    this.processQueue();
  }

  dispose = () => {
    this.socket.off('message', this.handleMessage);
    const { readyState } = this.socket;
    if (readyState === WebSocket.CONNECTING || readyState === WebSocket.OPEN) {
      this.socket.terminate();
    }
  };

  private async safeSend(data: any, options?: SendOptions) {
    assert(
      this.socket.readyState !== WebSocket.CONNECTING,
      'sendChunk is called after socket has been connected'
    );

    if (this.socket.readyState === WebSocket.OPEN) {
      await this.asyncSend(data, options);
    }
  }

  private async processQueue() {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    if (this.socket.readyState === WebSocket.CONNECTING) {
      await once(this.socket, 'open');
    }

    while (this.queue.length) {
      const data = this.queue.shift()!;
      if (typeof data === 'string' || Buffer.isBuffer(data)) {
        await this.safeSend(data)
      } else {
        for await (const chunk of data) {
          await this.safeSend(chunk);
        }
        this.socket.send('\x00');
      }
    }

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
      case 'prnt_scrn':
      case 'mouse_position':
        this.emit(cmd);
        break;

      case 'mouse_up':
      case 'mouse_down':
      case 'mouse_left':
      case 'mouse_right':
      case 'draw_circle':
      case 'draw_square':
        const [px] = args.map(Number);
        if (!isNaN(px)) {
          this.emit(cmd, px);
        }
        break;

      case 'draw_rectangle':
        const [px1, px2] = args.map(Number);
        if (!isNaN(px1) && !isNaN(px2)) {
          this.emit(cmd, px1, px2);
        }
        break;

      default:
        break;
    }
  };

  private handleError = (error: Error) => {
    console.error(error);
    this.dispose();
  };
}

export { WebSocketRobotIo };
