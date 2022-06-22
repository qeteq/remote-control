import { WebSocketServer } from 'ws';
import type { AddressInfo } from 'net';

import { createServer } from './http';
import { Robot } from './robot';
import { WebSocketRobotIo } from './io/web-socket-robot-io';
import { Rc } from './rc';
import { robotJsApi } from './robotjs-api';

const HTTP_PORT = 3000;

const server = createServer();
const ws = new WebSocketServer({ server });

const robot = new Robot(robotJsApi);

ws.on('connection', (s) => {
  const rc = new Rc(new WebSocketRobotIo(s), robot);
  s.once('close', () => rc.dispose());
  s.once('error', () => rc.dispose());
});

server.listen(HTTP_PORT, () => {
  const addr = server.address() as AddressInfo;
  console.log(`Listening on http://localhost:${addr.port}`);
});
