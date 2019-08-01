/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

import { Server } from 'restify';
import WebSocker, { VerifyClientCallbackSync } from 'ws';

import Socket from './socket';


const verifyClient: VerifyClientCallbackSync = ({ req: { headers } }): boolean => {
  if (headers['sec-websocket-protocol'] !== 'jonloureiro.dev') return false;
  console.log(headers);
  return true;
};


export = (server: Server): void => {
  const ws = new WebSocker.Server({
    server: server.server,
    verifyClient,
    path: '/ws',
    clientTracking: true,
    maxPayload: 16,
  });

  ws.on('connection', (socket: Socket): void => {
    socket.isAlive = true;

    socket.on('message', (message): void => {
      console.log(message);
      socket.send(message);
    });

    socket.on('error', (err): void => {
      console.log(err);
    });

    socket.on('close', (): void => {
      console.log('disconnected');
    });

    socket.on('pong', (): void => {
      socket.isAlive = true;
    });

    setInterval((): void => {
      if (!socket.isAlive) return socket.terminate();
      socket.isAlive = false;
      return socket.ping();
    }, 5000);
  });
}
