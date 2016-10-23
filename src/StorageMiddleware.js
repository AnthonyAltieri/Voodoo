/**
 * @author Anthony Altieri on 10/22/16.
 */

import * as Storage from './Storage';

export const addStorage = (call) => ({
  type: 'ADD',
  exec: () => {
    const storedCQ = Storage.get('CallQueue');
    const time = new Date().getTime();
    try {
      Storage.set(
        'CallQueue',
        !sotredCQ
          ? {time, cq: [call]}
          : {time, cq: [...storedCQ, call]}
      );
    } catch (e) {
      // Silently Fail
    }
  },
});


export const popStorage = () => ({
  type: 'POP',
  exec: () => {
    const storedCQ = Storage.get('CallQueue');
    if (!storedCQ) return;
    const time = new Date().getTime();
    try {
      Storage.set(
        'CallQueue',
        { time, cq: storedCQ.slice(1, storedCQ.length) }
      );
    } catch (e) {
      // Silently Fail
    }
  },
});
