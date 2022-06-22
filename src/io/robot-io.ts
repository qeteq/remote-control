import { EventEmitter } from '../util/ee';
import { Px, Vector } from '../types';

interface RobotIoEventsMap {
  mouse_up: [Px];
  mouse_down: [Px];
  mouse_left: [Px];
  mouse_right: [Px];
  mouse_position: [];
  draw_circle: [Px];
  draw_rectangle: [Px, Px];
  draw_square: [Px];
  prnt_scrn: [];
}

/**
 * Handle external input and output for our robot
 */
abstract class RobotIo extends EventEmitter<RobotIoEventsMap> {
  abstract sendMousePosition(coords: Vector): void;
  abstract sendScreenshot(data: Buffer): void;
  abstract dispose(): Promise<void>;
}

type Command = keyof RobotIoEventsMap;
const KNOWN_COMMANDS: Command[] = [
  'mouse_up',
  'mouse_down',
  'mouse_left',
  'mouse_right',
  'mouse_position',
  'draw_circle',
  'draw_rectangle',
  'draw_square',
  'prnt_scrn',
];

function isCommand(cmd: unknown): cmd is Command {
  return typeof cmd === 'string' && KNOWN_COMMANDS.includes(cmd as Command);
}

export { RobotIo, isCommand };
export type { Command };
