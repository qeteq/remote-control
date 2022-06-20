// import Jimp from 'jimp';
import { httpServer } from './http-server';
// import robot from 'robotjs';
import { WebSocketServer } from 'ws';
import { AddressInfo } from 'net';

const HTTP_PORT = 3000;

const ws = new WebSocketServer({ server: httpServer });

ws.on('connection', (s) => {
    s.on('message', (data) => {
        console.log(data.toString('utf8'));
    });
});

httpServer.listen(HTTP_PORT, () => {
    const addr = httpServer.address() as AddressInfo;
    console.log(`Listening on http://localhost:${addr.port}`);
});
