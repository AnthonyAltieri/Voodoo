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
    const isValidPriorState = !!priorState
        ? timeDiff(priorState.time) < validTimeDif
        : false;
    CallQueue = !!priorState && isValidPriorState ? priorState.cq : [];
    if(CallQueue.length>0){
     //Prior Call Queue exists
    }else{
      //No Call Queue Exists
    }
    middleware = [...defaultMiddleware];
    console.log("init");
    console.log(middleware);
  } catch (e) {
    // Silently fail
    console.log('error', e);
  }
};

export const add = (call, cq) : httpCall => {
  //TODO: Uncomment and Enable these once add has been tested

  if(!!cq){
    cq = [...cq, call].sort((l, r) => l.time - r.time);
  }
  else {
    cq = [call];
  }
  CallQueue = cq;
  const applicableMiddleware = middleware.filter(m => m.type === 'ADD');
  // applicableMiddleware.forEach((m) => {m.exec.bind(cq); });
  applicableMiddleware.forEach((m) => {m.exec(call, cq)});
  console.log("IN ADD in CallQueue");
  // console.log(JSON.stringify(cq, null, 2));
  return call;
};

export const pop = (cq) : httpCall => {
  if (!cq || cq.length === 0) return null;
  const first = cq[0];
  //TODO: Uncomment and Enable these once pop has been tested
  const applicableMiddleware = middleware.filter(m => m.type === 'POP');
  applicableMiddleware.forEach((m) => { m.exec(cq) });
  cq = cq.slice(1, cq.length);
  CallQueue = cq;
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
