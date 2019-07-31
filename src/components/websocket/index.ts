/* eslint-disable no-param-reassign */
import WebSocket, { Server, VerifyClientCallbackSync } from 'ws';

import './isAlive';

import server from '../../server';


const verifyClient: VerifyClientCallbackSync = ({ req: { headers } }): boolean => {
  if (headers['sec-websocket-protocol'] !== 'jonloureiro.dev') return false;
  // console.log(headers);
  return true;
};

const ws: Server = new Server({
  server: server.server,
  verifyClient,
  path: '/ws',
  clientTracking: true,
  maxPayload: 16,
});

ws.on('connection', (socket: WebSocket): void => {
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
    if (socket.isAlive === false) return socket.terminate();
    socket.isAlive = false;
    return socket.ping();
  }, 5000);
});
