// import WebSocket from 'ws';

// declare module 'ws' {
//   interface WebSocket {
//     isAlive?: boolean;
//   }
// }

import { EventEmitter } from 'events';

declare module 'events' {
  interface EventEmitter {
    isAlive?: boolean;
  }
}
