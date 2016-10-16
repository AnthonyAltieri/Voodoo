/**
 * @author Anthony Altieri on 10/14/16.
 * @author Bharat Batra on 10/14/16.
 */

import Heartbeat from './Heartbeat';
import { send } from './Ajax';
import * as Storage from './Storage';


const FLATLINE = 'flatline';

const Panic = {
  init,
  get,
  post,
};

function init(heartbeatEndpoint, type, secondsPerBeat, panicSecondsPerBeat = 10) {
  if (typeof heartbeatEndpoint === 'undefined') {
    throw new Error('Must have a valid heartbeat endpoint');
  }
  this.panicMilisecondsPerBeat = panicSecondsPerBeat;
  this.heartbeat = new Heartbeat(heartbeatEndpoint, type, secondsPerBeat);
}

function get(url, params, withCredentials = false) {
  http('GET', url, params, withCredentials);
}

function post(url, params, withCredentials = false) {
  http('POST', url, params, withCredentials);
}

function http(type, url, params, withCredentials = false) {
  if (this.heartbeat.isAlive) {
    const response = send(
      type,
      url,
      params,
      withCredentials
    )
  } else {
    if (!this.isPanic) {
      clearInterval(this.heartbeat.pacemaker);
      this.isPanic = true;
      const unsubscribe = this.heartbeat.subscribe(() => {
          clearInterval(this.crashcart);
      this.heartbeat.keepAlive();
      this.isPanic = false;
      const flatlineActions = Storage.get(FLATLINE);
      flatlineActions.forEach((a) => {
        // TODO: Deal with dead data
        const [toCall, time] = a.split('&');
        const type = toCall.split(':')[0];
        const [url, params, withCredentials] = toCall.split(',');
        switch (type) {
          case 'GET': {
            this.get(url, params, withCredentials);
            break;
          }
          case 'POST': {
            this.post(url, params, withCredentials);
            break;
        }
      }
    });
      unsubscribe();
    });
      this.crashcart = window.setInterval(
          () => {
          this.heartbeat.beat();
    }, this.panicMilisecondsPerBeat
    );
      Storage.set(FLATLINE, '[]');
    }
    const flatline = Storage.get(FLATLINE);
    const result = Storage.set(
        [...flatline,
        `${type}:${url},${params},${withCredentials}&time:${new Date().getTime()}`]
    )
  }
}

export default Panic;
