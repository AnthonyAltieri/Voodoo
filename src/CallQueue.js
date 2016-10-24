/**
 * @author Anthony Altieri on 10/22/16.
 */

import * as StorageMiddleware from './StorageMiddleware';
import * as Storage from './Storage';

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
const CQ_KEY = 'CallQueue';
const TWO_HOURS_MILLISECONDS = 2.7e6;

export const get = () => {
  return CallQueue;
};

// TODO: make valid time easier to set, not have to do milliseconds
export const init = (validTimeDif = TWO_HOURS_MILLISECONDS) => {
  try {
    const priorState = Storage.get(CQ_KEY);
    const timeDiff = (time) => new Date().getTime() - time;
    const isValidPriorState = timeDiff(priorState.time) < validTimeDif;
    CallQueue = !!priorState && isValidPriorState ? priorState.cq : [];
    middleware = [...defaultMiddleware];
  } catch (e) {
    // Silently fail
  }
};

export const add = (cq, call) : httpCall => {
  if (!cq) return;
  const applicableMiddleware = middleware.filter(m => m.type === 'ADD');
  applicableMiddleware.forEach((m) => { m.exec(call).bind(cq) });
  cq = [...cq, call].sort((l, r) => l.time - r.time);
  return call;
};

export const pop = (cq) : httpCall => {
  if (!cq || cq.length === 0) return null;
  const first = cq[0];
  const applicableMiddleware = middleware.filter(m => m.type === 'POP');
  applicableMiddleware.forEach((m) => { m.exec(first).bind(cq) });
  cq = cq.slice(1, CallQueue.length);
  return first;
};

export const addMiddleware = (middlewares, mw: cqMiddleware) : Function => {
  const currentMiddleware = middlewares.slice(0, middlewares.length);
  middlewares = [...middlewares, mw];
  return () => { middlewares = currentMiddleware };
};

export const removeAllMiddleware = (
  middlewares,
  defaultMiddleware,
  keepStorage: boolean = false
) : void => {
  if (keepStorage) {
    middlewares = [...defaultMiddleware];
    return;
  }
  middleware = [];
};

export const hasCalls = () : boolean => {
  return CallQueue.length > 0;
};

export default {
  init,
  add,
  pop,
  addMiddleware,
  removeAllMiddleware,
  get,
};
