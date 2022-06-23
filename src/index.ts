import { AddressInfo } from 'net';
import { WebSocketServer } from 'ws';
import { Automation, robotjsApi } from './automation';
import { createServer } from './http';
import { WebSocketInput } from './input';
import { WebSocketOutput } from './output';
import { RemoteControl } from './remote-control';

const HTTP_PORT = 8080;

const server = createServer();
const wss = new WebSocketServer({ server });
const automation = new Automation(robotjsApi);

wss.on('connection', (socket) => {
  const input = new WebSocketInput(socket);
  const output = new WebSocketOutput(socket);
  const rc = new RemoteControl({ input, output, automation });

  const cleanup = () => {
    input.dispose();
    rc.dispose();
    socket.off('error', cleanup);
    socket.off('close', cleanup);
  };
  socket.on('error', cleanup);
  socket.on('close', cleanup);
});

server.listen(HTTP_PORT, () => {
  const addr = server.address() as AddressInfo;
  console.log(`Listening on http://localhost:${addr.port}`);
});
