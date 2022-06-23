import { EventEmitter } from '../util';

import type { Input, InputEventsMap } from './interfaces';

abstract class BaseInput
  extends EventEmitter<InputEventsMap>
  implements Input {}

export { BaseInput };
