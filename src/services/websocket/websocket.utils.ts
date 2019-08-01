import WebSocket from 'ws';


// eslint-disable-next-line import/prefer-default-export
export class Socket extends WebSocket {
    public isAlive = false;
}
