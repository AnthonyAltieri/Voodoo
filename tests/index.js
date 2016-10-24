/**
 * @author Anthony Altieri on 10/15/16.
 */

import Panic from '../src/Panic';
import * as Storage from '../src/Storage';


const SERVER_PREFIX = 'http://159.203.234.179';
const HEARTBEAT_ENDPOINT = 'http://159.203.234.179/isAlive';
const FIVE_SECONDS = 5;
const ONE_SECOND = 1;
const TWO_SECONDS = 2;
const ONE_THIRD_SECOND = 0.33;
const TYPE = 'POST';


let panic;
let i=1;

function test() {
  console.log('Beginning test()');
  panic = new Panic(HEARTBEAT_ENDPOINT, {
    type: TYPE,
    secondsPerBeat: FIVE_SECONDS,
  });
}

function testPost() {
  panic.post(`${SERVER_PREFIX}/test`, { foo: i++ });
}

function testLocal() {
  Storage.set('key', 'value');
  const obj = Storage.get('key');
  obj.foo();
}

const testButton = document.createElement('button');
testButton.onclick = test;
testButton.innerHTML = 'Start Test';
document.body.appendChild(testButton);

const postButton = document.createElement('button');
postButton.onclick = testPost;
postButton.innerHTML = 'Send Post';
document.body.appendChild(postButton);

const storageButton = document.createElement('button');
storageButton.onclick = testLocal;
storageButton.innerHTML = 'Storage test';
document.body.appendChild(storageButton);

