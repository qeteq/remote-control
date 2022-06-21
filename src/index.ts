// import Jimp from 'jimp';
import { moveMouse, getMousePos, mouseToggle }  from 'robotjs';
import { WebSocketServer } from 'ws';

import { httpServer } from './http-server';
import { Robot } from './robot';
import { WebSocketRobotIo } from './io/web-socket-robot-io';

import type { AddressInfo } from 'net';
import { Rc } from './rc';

const HTTP_PORT = 3000;

const ws = new WebSocketServer({ server: httpServer });

const robot = new Robot({
  moveMouse,
  getMousePos,
  mouseToggle,
  dispose: () => {},
});

ws.on('connection', (s) => {
  const rc = new Rc(new WebSocketRobotIo(s), robot);
  s.once('close', () => rc.dispose());
  s.once('error', () => rc.dispose());
});

httpServer.listen(HTTP_PORT, () => {
  const addr = httpServer.address() as AddressInfo;
  console.log(`Listening on http://localhost:${addr.port}`);
});
