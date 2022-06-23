import type { TypedEventEmitter } from '../util/ee';
import type { Px } from '../types';

interface InputEventsMap {
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

type Command = keyof InputEventsMap;

type Input = TypedEventEmitter<InputEventsMap> & { dispose?(): void };

export type { Input, Command, InputEventsMap };
