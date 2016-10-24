/**
 * @author Anthony Altieri on 10/22/16.
 */

import * as Storage from './Storage';

const CQ_KEY = 'CallQueue';

export const addStorage = (call) => ({
  type: 'ADD',
  exec: () => {
    const storedCQ = Storage.get(CQ_KEY);
    const time = new Date().getTime();
    try {
      Storage.set(
        CQ_KEY,
        storedCQ
          ? {time, cq: [...storedCQ, call].sort((l, r) => l.time - r.time)}
          : {time, cq: [call]}
      );
    } catch (e) {
      // Silently Fail
    }
  },
});


export const popStorage = () => ({
  type: 'POP',
  exec: () => {
    const storedCQ = Storage.get(CQ_KEY);
    if (!storedCQ) return;
    const time = new Date().getTime();
    try {
      Storage.set(
        CQ_KEY,
        { time, cq: storedCQ.slice(1, storedCQ.length) }
      );
    } catch (e) {
      // Silently Fail
    }
  },
});
