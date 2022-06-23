import { Command } from './interfaces';

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

export { isCommand };
