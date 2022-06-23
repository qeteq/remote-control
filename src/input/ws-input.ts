import { WebSocket } from 'ws';
import type { RawData } from 'ws';

import { BaseInput } from './base';
import { isCommand } from './is-command';

class WebSocketInput extends BaseInput {
  private socket: WebSocket;

  constructor(client: WebSocket) {
    super();
    this.socket = client;

    this.socket.on('message', this.handleMessage);
    this.socket.once('error', this.handleError);
    this.socket.once('close', this.dispose);
  }

  dispose = () => {
    this.socket.off('message', this.handleMessage);
    this.socket.off('error', this.handleError);
    this.socket.off('close', this.dispose);
  };

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

export { WebSocketInput };
