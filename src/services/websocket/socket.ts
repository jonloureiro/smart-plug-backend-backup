import WebSocket from 'ws';


class Socket extends WebSocket {
    public isAlive = false;
}


export = Socket;
