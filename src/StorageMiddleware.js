// @flow

/**
 * @author Anthony Altieri on 10/22/16.
 */

import * as Storage from './Storage';

const CQ_KEY = 'CallQueue';
//
// export const addStorage = () => ({
//   type: 'ADD',
//   exec: (call) => {
//     const storedCQ = Storage.get(CQ_KEY);
//     const time = new Date().getTime();
//     try {
//       Storage.set(
//         CQ_KEY,
//         storedCQ
//           ? {time, cq: [...storedCQ, call].sort((l, r) => l.time - r.time)}
//           : {time, cq: [call]}
//       );
//     } catch (e) {
//       // Silently Fail
//     }
//   },
// });
//
//
// export const popStorage = () => ({
//   type: 'POP',
//   exec: () => {
//     const storedCQ = Storage.get(CQ_KEY);
//     if (!storedCQ) return;
//     const time = new Date().getTime();
//     try {
//       Storage.set(
//         CQ_KEY,
//         { time, cq: storedCQ.slice(1, storedCQ.length) }
//       );
//     } catch (e) {
//       // Silently Fail
//     }
//   },
// });



/*
Takes cq just in case it needs to perform some logic on it here
 */
const add = function(call, cq){
  console.log("Add called for call in storage mids" );
  let storedCQ = Storage.get(CQ_KEY);

  console.log(JSON.stringify(!!storedCQ ? storedCQ : "NO STORED CQ"));

  const time = new Date().getTime();
  try {
    Storage.set(
        CQ_KEY,
        !!storedCQ
            ? {time, cq: [...storedCQ.cq, call].sort((l, r) => l.time - r.time)}
            : {time, cq: [call]}
    );
    console.log("After the set");
    storedCQ = Storage.get(CQ_KEY);
    console.log(JSON.stringify(!!storedCQ ? storedCQ : "NO STORED CQ"));
  } catch (e) {
    console.log(e);
  }
};



/*
 Takes cq just in case it needs to perform some logic on it before saving
 */
const pop = function(cq){
  console.log("Pop called for call in storage mids" );
  const storedCQ = Storage.get(CQ_KEY);
  console.log(JSON.stringify(storedCQ));
  if (!storedCQ) return;
  const time = new Date().getTime();
  try {
    Storage.set(
        CQ_KEY,
        { time, cq: storedCQ.cq.slice(1, storedCQ.cq.length) }
    );
    console.log("After the set in POP");
    console.log(JSON.stringify(Storage.get(CQ_KEY)));
  } catch (e) {
    console.log(e);
    // Silently Fail
  }
};


export const addStorage = {
  type: 'ADD',
  exec: add
};


export const popStorage = {
  type: 'POP',
  exec: pop
};


