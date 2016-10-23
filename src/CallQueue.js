/**
 * @author Anthony Altieri on 10/22/16.
 */

import * as StorageMiddleware from './StorageMiddleware';

type cqMiddleware = {
  type: 'ADD' | 'POP',
  exec: Function,
};

type httpCall = 'string';

var CallQueue: httpCall[] = null;
var middleware: cqMiddleware[] = null;
var defaultMiddleware = [
  StorageMiddleware.addStorage,
  StorageMiddleware.popStorage
];

export const init = (priorState: httpCall[] = []) => {
  CallQueue = priorState;
  middleware = [...defaultMiddleware];
};

export const add = (call) : httpCall => {
  if (!CallQueue) return;
  const applicableMiddleware = middleware.filter(m => m.type === 'ADD');
  applicableMiddleware.forEach((m) => { m.exec(call).bind(CallQueue) });
  CallQueue = [...CallQueue, call].sort((l, r) => l.time - r.time);
  return call;
};

export const pop = () : httpCall => {
  if (!CallQueue || CallQueue.length === 0) return null;
  const first = CallQueue[0];
  const applicableMiddleware = middleware.filter(m => m.type === 'POP');
  applicableMiddleware.forEach((m) => { m.exec(first).bind(CallQueue) });
  CallQueue = CallQueue.slice(1, CallQueue.length);
  return first;
};

export const addMiddleware = (mw: cqMiddleware) : Function => {
  const currentMiddleware = middleware.slice(0, middleware.length);
  middleware = [...middleware, mw];
  return () => { middleware = currentMiddleware };
};

export const removeAllMiddleware = (keepStorage: boolean = false) : void => {
  if (keepStorage) {
    middleware = [...defaultMiddleware];
    return;
  }
  middleware = [];
};

export default { init, add, pop };
